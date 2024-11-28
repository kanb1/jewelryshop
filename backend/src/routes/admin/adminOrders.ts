import express from "express";
import Order from "../../models/Order";
import isAdmin from "../authMiddleware";

const router = express.Router();

// PUT /api/admin/orders/:id/status - Update order status
router.put("/:id/status", isAdmin, async (Request, Response) => {
  const { id } = Request.params;
  const { status } = Request.body;

  if (!["In Progress", "Completed", "Return", "Return Initiated"].includes(status)) {
     Response.status(400).json({ error: "Invalid status." });
    return;
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
       Response.status(404).json({ error: "Order not found." });
       return;
    }

    Response.status(200).json({ message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// PUT /api/admin/orders/:id/return - Approve a return
router.put("/:id/return", isAdmin, async (Request, Response) => {
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
