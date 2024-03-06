import 'dotenv/config';

import path from 'path';
import request from 'request';
import express from 'express';
import axios from 'axios';
import { type IService, type ISite, render } from './render';

const port = process.env.PORT ?? 3000;
const token = process.env.API_TOKEN;
const api_domain = process.env.API_DOMAIN;

async function getSite() {
    const result: { data: { attributes: ISite } } = (await axios.get(`${api_domain}/api/site`, {
        responseType: 'json',
        params: {
            'populate[home_content][populate]': '*',
            'populate[bio_image][populate]': '*',
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
    })).data;

    return result.data.attributes;
}

async function getServices() {
    const result: { data: { attributes: IService }[] } = (await axios(`${api_domain}/api/services`, {
        method: 'GET',
        responseType: 'json',
        params: {
            'populate[content][populate]': '*',
            'populate[banner_image][populate]': '*',
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })).data;

    return result.data.map(x => x.attributes);
}

const app = express();

function proxy(url: string) {
    return function(req: express.Request, res: express.Response) {
        return req.pipe(request({
            uri: `${url}${req.url}`,
            qs: req.query,
            headers: req.headers,
        })).pipe(res);
    }
}

app.use(express.static(path.join(__dirname, `../public`)));

app.use('/api', proxy(`${api_domain}/api`));
app.use('/admin', proxy(`${api_domain}/admin`));
app.use('/content-manager', proxy(`${api_domain}/content-manager`));
app.use('/content-type-builder', proxy(`${api_domain}/content-type-builder`));
app.use('/i18n', proxy(`${api_domain}/i18n`));
app.use('/uploads', proxy(`${api_domain}/uploads`));

app.get('/', async (request, response) => {
    const services = await getServices();
    const site = await getSite();
    return response.send(render({ services, site }).homepage(site));
});

app.get('/services/:slug', async (request, response) => {
    const slug = request.params.slug ?? '';

    const services = await getServices();
    const service = services.find(x => x.header.toLowerCase().split(' ').join('-') === slug) ?? null;
    if (service !== null) {
        const site = await getSite();
        return response.send(render({ services, site }).service(service));
    }

    return response.sendStatus(404);
});

app.get('/appointments', async (request, response) => {
    const services = await getServices();
    const site = await getSite();
    return response.send(render({ services, site }).appointments(site));
});

app.use((error: { status: number, message: string }, request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';


        console.log(`[${request.method}] ${request.path} >> StatusCode:: ${status}, Message:: ${message}`);
        response.status(status).json({ message });
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => console.log(`🚀 App listening on the port ${port}`));
