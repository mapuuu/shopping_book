import Product from "../models/book.js";
import expressAsyncHandler from "express-async-handler";

//Get book
export const getBook = async(req, res) => {
    const products = await Product.find();
    res.send(products);
}

//Create book --Admin
export const createBook = expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
        title: 'Title',
        author: 'Name',
        description: 'sample description',
        publishDate: Date.now(),
        pageCount: 1,
        image: 'choose image',
        price: 10000,
        category: 'sample category',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
});

//Update book --Admin
export const updateBook = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.title = req.body.title;
        product.author = req.body.author;
        product.description = req.body.description;
        product.publishDate = req.body.publishDate;
        product.pageCount = req.body.pageCount;
        product.image = req.body.image;
        product.images = req.body.images;
        product.category = req.body.category;
        product.price = req.body.price;
        product.countInStock = req.body.countInStock;
        await product.save();
        res.send({ message: 'Product Updated' });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

//Delete book --Admin
export const deleteBook = expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
});

//Review book
export const addReview = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        if (product.reviews.find((x) => x.name === req.user.name)) {
            return res
            .status(400)
            .send({ message: 'You already submitted a review' });
        }

        const review = {
            name: req.user.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((a, c) => c.rating + a, 0) /
            product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
            message: 'Review Created',
            review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
            numReviews: product.numReviews,
            rating: product.rating,
        });
        } else {
        res.status(404).send({ message: 'Product Not Found' });
        }
});

const PAGE_SIZE = 3;
//Get book --Admin
export const getBookAdmin = expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
});

//Search book
export const searchBook = expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                $regex: searchQuery,
                $options: 'i',
                },
            }
            : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                $gte: Number(rating),
                },
            }
            : {};
    const priceFilter =
        price && price !== 'all'
            ? {
                // 1-50
                price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1]),
                },
            }
            : {};
    const sortOrder =
        order === 'featured'
            ? { featured: -1 }
            : order === 'lowest'
            ? { price: 1 }
            : order === 'highest'
            ? { price: -1 }
            : order === 'toprated'
            ? { rating: -1 }
            : order === 'newest'
            ? { createdAt: -1 }
            : { _id: -1 };

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    });
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
});

//Get by category
export const getByCategory = expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
});

//See book
export const seeBook = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
};

//Get one book
export const getOneBook =  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
};