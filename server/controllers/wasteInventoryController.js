import WasteInventory from "../models/WasteInventory.js";

export const getInventory = async (req, res) => {
  try {
    console.log("hi")
    const { waste_type, status } = req.query;
    let filter = {};

    if (waste_type) filter.waste_type = waste_type;
    if (status) filter.status = status;
    else filter.status = 'available';

    const inventory = await WasteInventory.find(filter);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await WasteInventory.findOne({ inventory_id: req.params.id });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const inventory = new WasteInventory(req.body);
    await inventory.save();
    
    res.status(201).json({ message: "Inventory item created", inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const inventory = await WasteInventory.findOneAndUpdate(
      { inventory_id: req.params.id },
      req.body,
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory updated", inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteInventory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const inventory = await WasteInventory.findOneAndDelete({ inventory_id: req.params.id });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory deleted", inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
