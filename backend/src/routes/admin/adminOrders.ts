import express from "express";
import Order from "../../models/Order";
import adminMiddleware from '../authMiddleware';


const router = express.Router();
router.use(adminMiddleware); // Apply admin middleware to all routes in this file



// PUT /api/admin/orders/:id/status - Update order status
// PUT /api/admin/orders/:id/status - Update the status of an order
router.put("/:id/status", adminMiddleware, async (Request, Response) => {
  const { id } = Request.params;
  const { status } = Request.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      Response.status(404).json({ error: "Order not found." });
      return;
    }

    if (status === "Completed") {
      // Check if the order had a return initiated
      if (order.returnInitiated) {
        order.returnStatus = "Refunded";
      }
    }

    // Update the status of the order
    order.status = status;
    await order.save();

    Response.status(200).json({ message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});


// PUT /api/admin/orders/:id/return - Approve a return
router.put("/:id/return", adminMiddleware, async (Request, Response) => {
  const { id } = Request.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
       Response.status(404).json({ error: "Order not found." });
       return;
    }

    if (order.status !== "Return Initiated") {
       Response.status(400).json({ error: "Order is not marked for return." });
       return;
    }

    order.status = "Return";
    await order.save();

    Response.status(200).json({ message: "Order return approved.", order });
  } catch (error) {
    console.error("Error approving return:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

export default router;
