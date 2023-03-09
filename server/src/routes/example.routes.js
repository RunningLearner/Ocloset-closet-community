import { Router } from 'express';

export const path = '/example';
export const router = Router();

const examplefunc = () => {
    return 1;
}

/**
 * @openapi
 * /api/example/example1:
 *    get:
 *      description: 
 *      tags:
 *      - example
 *      responses:
 *        '302':
 *          description: ,,
 *          headers:
 *             Location:
 *               description: ,,
 *               schema:
 *                 type: string
 *                 format: uri
 */
router.get('/example1', examplefunc);