const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');


router.get('/add-new', (req,res)=>{
    return res.render('addBlog', {
        user :req.user
    })
})

router.get('/:id',async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({blogId : req.params.id}).populate('createdBy');
    //  console.log("blog", blog);
     console.log("comments", comments);
    return res.render('blog', {
         user: req.user,
         blog,
         comments,
    });
   
})

router.post('/comment/:blogId', async(req,res)=>{
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id,
  });
  // console.log(comment)
  return res.redirect(`/blog/${req.params.blogId}`)
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/',upload.single('coverImage'),async(req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy : req.user._id,
        coverImageURL : `uploads/${req.file.filename}`

    })
   console.log(req.body)
   console.log(req.file)
   return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;