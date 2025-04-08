const productModel = require('../Model/productModel');
const {MultipleImage} = require('../Middleware/MultipleImage')

exports.CreateProduct = async (req, res) => {
    try {
        let imageUrls = await MultipleImage(req); 

        const newProduct = await productModel.create({ productImgALL: imageUrls });

        res.status(201).json({ status: true, msg: 'Product created', data: newProduct });
    } catch (e) {
        console.error('Product creation error:', e);
        res.status(500).json({ status: false, msg: e.message || 'Failed to create product' });
    }
};

// Get all products
exports.GetAllProducts = async (req, res) => {
    try {
        const { category, mediaType, search, minRating } = req.query;
        const filter = { isDelete: false };

        if (category) filter.productCategory = category;
        if (mediaType) filter.mediaType = mediaType;
        if (minRating) filter.rating = { $gte: Number(minRating) };
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { director: { $regex: search, $options: 'i' } },
                { cast: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await productModel.find(filter);
        res.status(200).send({ status: true, data: products });
    } catch (e) {
        res.status(500).send({ status: false, msg: e.message });
    }
};

// Get product by ID
exports.GetProductById = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.id, isDelete: false });
        if (!product) {
            return res.status(404).send({ status: false, msg: "Product not found" });
        }
        res.status(200).send({ status: true, data: product });
    } catch (e) {
        res.status(500).send({ status: false, msg: e.message });
    }
};

// Update product
exports.UpdateProduct = async (req, res) => {
    try {
        const updates = req.body;

        // Handle file updates if needed
        if (req.files?.productImg) {
            updates.productImg = req.files.productImg[0].path;
        }
        if (req.files?.productImgALL) {
            updates.productImgALL = req.files.productImgALL.map(file => file.path);
        }
        if (req.files?.downloadLinks) {
            updates.downloadLinks = req.files.downloadLinks.map(file => file.path);
        }

        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ status: false, msg: "Product not found" });
        }

        res.status(200).send({
            status: true,
            msg: "Product updated successfully",
            data: product
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: e.message });
    }
};

// Delete product (soft delete)
exports.DeleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            { isDelete: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ status: false, msg: "Product not found" });
        }

        res.status(200).send({
            status: true,
            msg: "Product deleted successfully"
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: e.message });
    }
};

// Record a download (for accounting)
exports.RecordDownload = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                $inc: { totalDownloads: 1, revenueGenerated: req.body.amount || 0 },
                lastDownloadDate: new Date()
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).send({ status: false, msg: "Product not found" });
        }

        res.status(200).send({
            status: true,
            msg: "Download recorded successfully",
            data: product
        });
    } catch (e) {
        res.status(500).send({ status: false, msg: e.message });
    }
};