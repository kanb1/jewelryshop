import express from "express";
import Order from "../../models/Order";
import adminMiddleware from '../authMiddleware';
import NodeCache from "node-cache";


const router = express.Router();
router.use(adminMiddleware); // Apply admin middleware to all routes in this file!!

// Initialize NodeCache instance with timelimit
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache for 5 minutes



// ******************************* Fetch all orders
router.get("/", adminMiddleware, async (Request, Response) => {
  try {
    // defines unique cache key for storing and retrieving the cached data
    const cacheKey = "all-orders";

    // Check if the data exists in the cache
    const cachedOrders = cache.get(cacheKey);
    if (cachedOrders) {
      // logs cache hit if response is from the cache
      console.log("Cache hit for admin orders");
       Response.status(200).json(cachedOrders); // Return cached data
       return;
    }

    // if not sent from cache, logs this:
    console.log("Cache miss for admin orders");

    // Fetches all orders from the db for the admin to view
    // Using .lean() to return plain JavaScript objects instead of Mongoose documents
      // data is lightweight, cause we only cach.. no modifications (queries..), simplifies the data structure
    const orders = await Order.find().lean(); 

    // Store the fetched orders in the cache
    cache.set(cacheKey, orders);
    console.log("Orders cached successfully");

    Response.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});




//******************************** Update Orderstatus
// URL path with dynamic id that identify specific order
router.put("/:id/status", adminMiddleware, async (Request, Response) => {
  // Extracts the id parameter from the URL (OrderID)
  const { id } = Request.params;
  // extracts the new status eg completed, in progress from the frontend
  const { status } = Request.body;

  try {
    // find the specific order doc in the db by id
    const order = await Order.findById(id);

    if (!order) {
      Response.status(404).json({ error: "Order not found." });
      return;
    }

    // Logic for completed status
    // if the new status from the reqbody is "completed" --> we check if a return process was already initiated (order.returnInitiated)
    if (status === "Completed") {
      // Check if the order had a return initiated
      // if true --> updates returnstatus to refunded
      if (order.returnInitiated) {
        order.returnStatus = "Refunded";
      }
    }

    // Update the status of the order with new status
    order.status = status;
    // save in db
    await order.save();

    Response.status(200).json({ message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});


//******************************** Approve a return (BRUGES IKKE)
// this route only approves that the return process has started, not shown in UI yet
  // when user clicks "initiate return", this route gets triggered
  // If UI: for the admin, it means that it allows the admin to review the return request, once reviewed, the admin can approve it and marking the status as return (the overall status of the orders). The return-status endpoint trakcs finer details about the return (pending, received and so on)
  // It's because I was trying to simualte realworld scenario, where an admin needs to "approve" the return and call it "Return" before I can mark it as recieved and so on
  // for later on I can expand the flow with "Approve return", but for now it's indirectly implied when the return status changes to received or refunded 
router.put("/:id/return", adminMiddleware, async (Request, Response) => {
  // gets the id parameter fromt he URL (orderID)
  const { id } = Request.params;

  try {
    // fidns the order in the db by id
    const order = await Order.findById(id);

    if (!order) {
       Response.status(404).json({ error: "Order not found." });
       return;
    }

    // ensures the orders status is "return inititated"
    if (order.status !== "Return Initiated") {
       Response.status(400).json({ error: "Order is not marked for return." });
       return;
    }

    // Updates the order's status to "Return"
    order.status = "Return";
    await order.save();

    Response.status(200).json({ message: "Order return approved.", order });
  } catch (error) {
    console.error("Error approving return:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

//******************************** Update returnstatus
// updates the returnStatus field of an order (received, refunded)
router.put("/:id/return-status", adminMiddleware, async (Request, Response) => {
  const { id } = Request.params;
  const { returnStatus } = Request.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
       Response.status(404).json({ error: "Order not found." });
       return;

    }

    // Ensure the order is in a returnable state
    if (!order.returnInitiated) {
       Response.status(400).json({ error: "Return has not been initiated for this order." });
       return;

    }

    // Checks if returnStatus is valid
    if (["Pending", "Received", "Refunded"].includes(returnStatus)) {
      // ipdates the returnstatus of the order
      order.returnStatus = returnStatus;

      // If the status is "Refunded," marking the overall order as completed
      if (returnStatus === "Refunded") {
        order.status = "Completed";
      }

      await order.save();
       Response.status(200).json({ message: "Return status updated successfully.", order });
      return;

    } else {
       Response.status(400).json({ error: "Invalid return status provided." });
       return;
    }
  } catch (error) {
    console.error("Error updating return status:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});


export default router;
