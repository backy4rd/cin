import * as express from 'express';

import movieController from '../controllers/movie_controller';
import authController from '../controllers/auth_controller';

import identityMiddleware from '../middlewares/identity_middleware';
import uploadMiddleware from '../middlewares/upload_middleware';

const router = express.Router();

router.use(express.json());

// User permission
router.get('/:movie_id(\\d+)', movieController.getMovieById);
router.get('/showing', movieController.getShowingMovies);
router.get('/upcomming', movieController.getUpcommingMovies);

// Manager permission
router.post(
    '/',
    authController.authorize,
    identityMiddleware.isManager,
    uploadMiddleware.storeUploadFiles,
    movieController.validatePostMovieRequestAndSendResponse,
    movieController.makeHlsFiles,
    movieController.createMovieRecord,
    uploadMiddleware.removeTempUploadFiles,
);

router.get(
    '/',
    authController.authorize,
    identityMiddleware.isManager,
    movieController.getMovies,
);

router.patch(
    '/:movie_id(\\d+)',
    authController.authorize,
    identityMiddleware.isManager,
    uploadMiddleware.storeUploadFiles,
    movieController.updateMovie,
    uploadMiddleware.removeTempUploadFiles,
);

router.delete(
    '/:movie_id(\\d+)',
    authController.authorize,
    identityMiddleware.isManager,
    movieController.deleteMovie,
);

export default router;
