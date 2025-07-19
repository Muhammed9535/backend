import express from 'express'
import isAuthenticated from '../middleWare/Authenticated.js';
import { addToWishList, removeFromWishList, getWishList, moveAllToBag } from '../controller/wishListController.js';
const wishListRouter = express.Router();

wishListRouter.post('/add', isAuthenticated, addToWishList)
wishListRouter.post('/remove', isAuthenticated, removeFromWishList)
wishListRouter.get('/getwistlist', isAuthenticated, getWishList)
wishListRouter.get('/move-to-bag', isAuthenticated, moveAllToBag)

export default wishListRouter