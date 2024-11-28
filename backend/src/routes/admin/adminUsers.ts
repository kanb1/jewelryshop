import express from "express";
import User from "../../models/User";
import isAdmin from "../authMiddleware";

const router = express.Router();

// GET /api/admin/users - Fetch all users
router.get("/", isAdmin, async (Request, Response) => {
  try {
    const users = await User.find({}, "-password"); // Exclude sensitive data like passwords
    Response.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/admin/users/:id - Fetch user details
router.get("/:id", isAdmin, async (Request, Response) => {
  const { id } = Request.params;

  try {
    const user = await User.findById(id, "-password");
    if (!user) {
       Response.status(404).json({ error: "User not found." });
       return;
    }
    Response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// PUT /api/admin/users/:id - Update user role or details
router.put("/:id", isAdmin, async (Request, Response) => {
  const { id } = Request.params;
  const { role, isActive } = Request.body;

  try {
    const user = await User.findById(id);
    if (!user) {
       Response.status(404).json({ error: "User not found." });
       return;
    }

    if (role) user.role = role; // Update user role (e.g., "admin" or "user")
    if (isActive !== undefined) user.isActive = isActive; // Activate or deactivate user

    await user.save();
    Response.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete("/:id", isAdmin, async (Request, Response) => {
  const { id } = Request.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
       Response.status(404).json({ error: "User not found." });
       return;
    }
    Response.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    Response.status(500).json({ error: "Internal server error." });
  }
});

export default router;
