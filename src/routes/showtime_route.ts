import * as express from 'express';

import showtimeController from '../controllers/showtime_controller';
import authController from '../controllers/auth_controller';

import identityMiddleware from '../middlewares/identity_middleware';

const router = express.Router();

router.use(express.json());

// User permission
router.get('/:showtime_id(\\d+)', showtimeController.getShowtimesById);
router.get('/playing', showtimeController.getPlayingShowtimeByMovieId);

// Manager permission
router.post(
    '/',
    authController.authorize,
    identityMiddleware.isManager,
    showtimeController.createShowtime,
);
router.patch(
    '/:showtime_id(\\d+)',
    authController.authorize,
    identityMiddleware.isManager,
    showtimeController.updateShowtime,
);
router.delete(
    '/:showtime_id(\\d+)',
    authController.authorize,
    identityMiddleware.isManager,
    showtimeController.deleteShowtime,
);

export default router;
