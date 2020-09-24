import {
    Validator,
    MinLength,
    MaxLength,
    DBUnique,
} from 'com.siteblade.nodejs.www.api';

import {
    ItemsPerPage,
    OrderBy,
    Comparison,
} from 'com.siteblade.nodejs.database.orm';

import { JSON, Enum, FlagsEnum } from 'com.siteblade.util';

import { File } from 'com.siteblade.nodejs.filesystem';

import TranslationProvider from '../TranslationProvider.js';

import AdministratorAuth from '../auth/AdministratorAuth.js';

import BlogPost, { ThumbType } from '../database/entities/BlogPost.js';

import CORS from '../CORS.js';

import normalizeName from 'normalize-name';

import Multer from 'multer';

export default class BlogController {
    constructor(eApp) {
        // begin post Validator
        this.postValidator = new Validator({
            fields: {
                title: [ MinLength(3), MaxLength(127) ],
                subtitle: [ MinLength(3), MaxLength(255) ],
                content:  [ MinLength(3), MaxLength(2000000) ],
            },
            steps: [
                async (fields, report, eReq) => {
                    let thumbV = verifyThumbnail(eReq, report);

                    if (!thumbV) return;

                    let { thumbType } = thumbV;
                    let fId = await arrangeFriendlyId(fields.title);
                    return { fId, thumbType, fields };
                },
            ],
        });
        // end post Validator

        const verifyThumbnail = (eReq, report) => {
            let thumbFile = eReq.files[0];
            let thumbType = thumbFile ? ThumbType.fromFilePath(thumbFile.originalname) : ThumbType.NONE;

            if (thumbFile && !thumbType) {
                report('thumb', 'validation.unsupportedThumbnail');
                return undefined;
            }

            return { thumbType };
        };

        const arrangeFriendlyId = async title => {
            let fId = normalizeName(title);
            fId = fId.startsWith('_') ? fId.slice(1) : fId;
            fId = fId.replace(/_/g, '.').toLowerCase();
            let fIdCount = 1;

            while ((await BlogPost.find({ friendlyId: fId + (fIdCount == 1 ? '' : '.' + fIdCount) })).length > 0) ++fIdCount;

            return fId + (fIdCount == 1 ? '' : '.' + fIdCount);
        };

        this.listPosts(eApp);

        this.createPost(eApp);

        this.readPost(eApp);

        this.updatePost(eApp);

        this.deletePost(eApp);
    }

    listPosts(eApp) {
        eApp.get('blog', CORS.all(), async (req, res) => {
            let page = await BlogPost.page(parseInt(req.query.page || 1) - 1, ItemsPerPage(10), OrderBy('createdAt', 'desc'));
            res.end(JSON.stringify({ page: page.toJSON(), }));
        });
    }

    createPost(eApp) {
        eApp.post('blog', CORS.all(), Multer().array('thumb', 1), AdministratorAuth, this.postValidator.eMiddleware(TranslationProvider), async (req, res) => {
            let { fId, thumbType, fields } = req.validationResult;

            let post = await BlogPost.add({
                friendlyId: fId,
                title: fields.title,
                subtitle: fields.subtitle,
                thumb: thumbType,
                content: fields.content,
            });

            if (thumbType != 'none') await new File(`storage/app/public/blogThumb/${post.id}.${thumbType == 'video' ? 'mp4' : 'png'}`).write(req.files[0].buffer);

            res.end( JSON.stringify(post.toJSON()) );
        });
    }

    readPost(eApp) {
        eApp.get('blog/:postId', CORS.all(), async (req, res) => {
            let [ post ] = await BlogPost.find({ friendlyId: req.params.postId });

            if (!post) {
                res.statusCode = 404, res.end('{}');
                return;
            }

            res.end(JSON.stringify(post.toJSON()));
        });
    }

    updatePost(eApp) {
        eApp.put('blog/:postId', CORS.all(), Multer().array('thumb', 1), AdministratorAuth, this.postValidator.eMiddleware(TranslationProvider), async (req, res) => {
            let { fId, thumbType, fields } = req.validationResult;
            let [ post ] = await BlogPost.find({ id: req.params.postId });

            if (!post) return;

            await post.update({
                friendlyId: fields.title == post.title ? post.friendlyId : fId,
                title: fields.title,
                subtitle: fields.subtitle,
                content: fields.content,
                thumbType: thumbType == 'none' ? post.thumbType : thumbType,
                updatedAt: new Date,
            });

            if (thumbType != 'none') await new File(`storage/app/public/blogThumb/${post.id}.${thumbType == 'video' ? 'mp4' : 'png'}`).write(req.files[0].buffer);

            res.end( JSON.stringify(post.toJSON()) );
        });
    }

    deletePost(eApp) {
        eApp.delete('blog/:postId', CORS.all(), AdministratorAuth, async (req, res) => {
            //
        });
    }
}