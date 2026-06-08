const product= require('../model/product');
const cloudinary = require('../config/cloudinary');
 
const getproducts= async(req,res)=>{
    try {
        const products= await product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const getproductbyid= async(req,res)=>{ 
    try {
        const productid= req.params.id;
        const productdata= await product.findById(productid);
        if (!productdata) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(productdata);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const createproduct= async(req,res)=>{
    try {
        const {name, description, price, category,stock} = req.body;
        let imageUrl;
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const newProduct = new product({name, description, price, category,stock, imageUrl});
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const updateproduct= async(req,res)=>{
    try {
        const {name, description, price, category,stock} = req.body;
        const productid= await product.findById(req.params.id);
        if(productid){  
            productid.name= name || productid.name;
            productid.description= description || productid.description;
            productid.price= price || productid.price;
            productid.category= category || productid.category;
            productid.stock= stock || productid.stock;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log(result);
                productid.imageUrl = result.secure_url;
            }
            const updatedProduct = await productid.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const deleteproduct= async(req,res)=>{
    try {
        const productid= await product.findById(req.params.id);
            if(productid){
                await productid.deleteOne();
                res.json({message: 'Product removed'});
            }else {
                res.status(404).json({message: 'Product not found'});
            }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

module.exports= {getproducts,getproductbyid,createproduct,updateproduct,deleteproduct};