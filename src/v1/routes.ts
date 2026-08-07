import { Router } from 'express';

import { authRouter } from './modules/auth/auth.routes.js';
import { healthRouter } from './modules/health/health.routes.js';
import { churchRouter } from './modules/church/church.routes.js';
import { memberRouter } from './modules/member/member.routes.js';
import { ministryRouter } from './modules/ministry/ministry.routes.js';
import { announcementRouter } from './modules/announcement/announcement.routes.js';
import { eventRouter } from './modules/event/event.routes.js';
import { contributionRouter } from './modules/contribution/contribution.routes.js';
import { inventoryRouter } from './modules/inventory/inventory.routes.js';
import { bibleStudyRouter } from './modules/bible-study/bible-study.routes.js';
import { documentRouter } from './modules/document/document.routes.js';

export const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/health', healthRouter);
v1Router.use('/church', churchRouter);
v1Router.use('/members', memberRouter);
v1Router.use('/ministries', ministryRouter);
v1Router.use('/announcements', announcementRouter);
v1Router.use('/events', eventRouter);
v1Router.use('/contributions', contributionRouter);
v1Router.use('/inventory', inventoryRouter);
v1Router.use('/bible-studies', bibleStudyRouter);
v1Router.use('/documents', documentRouter);
