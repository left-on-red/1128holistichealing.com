interface IButton {
    label: string;
    color: string;
    __component: 'content.button'
}

function button(data: IButton) {
    return `<button class="btn btn-primary" role="button" href="/appointments">${data.label}</button>`;
}

interface ICTA {
    button: IButton | null;
    content: string | null;
    __component: 'content.cta';
}

function cta(data: ICTA) {
    return `<div class="text-center">
            ${data.content ?? ''}
            ${data.button !== null ? button(data.button) : ''}
        </div>`;
}

interface IGridColumn {
    content: string | null;
    class: string | null;
    name: string | null;
    __component: 'layout.grid-column';
}

function gridColumn(data: IGridColumn) {
    return `
        <div${data.class !== null ? ` class="${data.class}"` : ''}>
            ${data.name !== null ? `<h2>${data.name}</h2>` : ''}
            ${data.content}
        </div>
    `;
}

interface IGridRow {
    columns: IGridColumn[];
    __component: 'layout.grid-row';
}

function gridRow(data: IGridRow) {
    return `
        <div class="row">
            ${data.columns.map(gridColumn).join('\n')}
        </div>
    `;
}

interface IContent {
    plain_content: string;
    __component: 'layout.content';
}

function content(data: IContent) {
    return data.plain_content;
}

interface IImageFormat {
    name: string;
    hash: string;
    ext: string;
    mine: string;
    width: number;
    height: number;
    size: number;
    url: string;
}

interface IImageData extends IImageFormat {
    alternativeText: string | null;
    caption: string | null;
    formats: {
        thumbnail: IImageFormat;
        small: IImageFormat;
        medium: IImageFormat;
        large: IImageFormat;
    }
}

export interface IService {
    header: string;
    headline: string;
    meta_title: string;
    meta_description: string;
    content: (IGridRow | IContent | ICTA | IButton)[];
    banner_image: {
        data: { attributes: IImageData } | null;
    }
}

function service(data: IService) {
    console.log(data);
    return `
        <div class="banner" ${data.banner_image ? `style="background-image: linear-gradient(to right, #ffffff80, 30%, #fff), url('${data.banner_image?.data?.attributes?.url}');` : ''}">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h1>${data.header}</h1>
                        <p class="lead">${data.headline ?? ''}</p>
                    </div>
                </div>
            </div>
        </div>
        <section class="py-5">
            <div class="container">
                ${data.content.map(x => {
                    if (x.__component === 'layout.grid-row') {
                        return gridRow(x);
                    } else if (x.__component === 'layout.content') {
                        return content(x);
                    } else if (x.__component === 'content.cta') {
                        return cta(x);
                    } else if (x.__component === 'content.button') {
                        return button(x);
                    } else {
                        return '';
                    }
                }).join('\n')}
            </div>
        </section>
    `
}

export interface ISite {
    navbar_header: string;
    bio_phonenumber: string;
    bio_email: string;
    bio_name: string;
    bio_photo: {
        data: { attributes: IImageData } | null;
    },
    color_primary: string;
    color_secondary: string;
    color_accent: string;
    color_background: string;
    home_content: (IGridRow | IContent | ICTA | IButton)[];
}

function homepage(data: ISite) {
    return `
        <div class="container">
            <div class="row mb-3">
                <div class="col-12 text-center">
                    <h1 class="w-100">1128 Holistic Healing</h1>
                    <small class="w-100">NAET Practitioner • Licensed Massage Therapist • Authorized BEMER Distributor</small>
                </div>
                <div class="col-12 d-flex justify-content-center">
                    <figure class="border rounded py-1 px-2 mt-2">
                        <blockquote class="blockquote">Come unto me, all ye that labour and are heavy laden, and I will give you rest.</blockquote>
                        <figcaption class="blockquote-footer">
                            Matthew 11:28
                        </figcaption>
                    </figure>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3">
                    <div class="row">
                        <div class="col-12 d-flex justify-content-center">
                            <figure class="figure">
                                <img class="figure-img img-fluid rounded" alt="alt text" width="300" src="${data.bio_photo?.data.attributes.url}">
                                <figcaption class="figure-caption text-center">${data.bio_name}</figcaption>
                            </figure>
                        </div>
                        <div class="col-12 d-flex justify-content-center">
                            <ul class="list-unstyled border rounded w-100 px-1">
                                <li><a><i class="bi bi-geo-alt-fill"></i> TBD</a></li>
                                <li><a href="tel:+1${data.bio_phonenumber.replace(/\D/g, '')}"><i class="bi bi-telephone-fill"></i> ${data.bio_phonenumber}</a></li>
                                <li><a href="mailto:${data.bio_email}"><i class="bi bi-envelope-fill"></i> ${data.bio_email}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 px-5">
                    <div class="container">
                        ${data.home_content.map(x => {
                            if (x.__component === 'layout.grid-row') {
                                return gridRow(x);
                            } else if (x.__component === 'layout.content') {
                                return content(x);
                            } else if (x.__component === 'content.cta') {
                                return cta(x);
                            } else if (x.__component === 'content.button') {
                                return button(x);
                            } else {
                                return '';
                            }
                        }).join('\n')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

interface IRenderContext {
    services: IService[];
    site: ISite;
}

export function render(context: IRenderContext) {
    function wrap(data: { title: string | null, description: string | null, content: string }) {
        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    ${data.title !== null ? `<title>${data.title}</title>` : ''}
                    ${data.description !== null ? `<meta name="description" content="${data.description}"></meta>` : ''}
                    <style lang="css">
                        :root {
                            --primary-color: ${context.site.color_primary};
                            --secondary-color: ${context.site.color_secondary};
                            --accent-color: ${context.site.color_accent};
                            --background-color: ${context.site.color_background};
                        }
                    </style>
                    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
                    <link rel="stylesheet" type="text/css" href="/css/bootstrap-icons.css">
                    <link rel="stylesheet" type="text/css" href="/css/main.css">
                    <script src="/js/bootstrap.min.js"></script>
                </head>
                <body>
                    <div class="d-flex flex-column min-vh-100">
                        <nav class="navbar navbar-expand-md shadow sticky-top">
                            <div class="container-fluid">
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-toggle" aria-controls="navbar-toggle" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbar-toggle">
                                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                                        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#servicesDropdown" role="button" aria-expanded="false" aria-controls="servicesDropdown">Services</a>
                                            <ul class="dropdown-menu collapse" id="servicesDropdown">
                                                ${context.services.map(service => `<li><a class="dropdown-item" href="/services/${service.header.toLowerCase().split(' ').join('-')}">${service.header}</a></li>`).join('\n')}
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul class="navbar-nav ml-auto">
                                        <li class="nav-item"><a class="nav-link" href="/appointments">Book an Appointment</a></li>
                                        <!-- <li class="nav-item"><a class="nav-link" href="/forms">Intake Forms</a></li>
                                        <li class="nav-item"><a class="nav-link" href="/contact">Contact Us</a></li>
                                        {{right_nav}}
                                         -->
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        ${data.content}
                        <footer class="text-center py-3 mt-auto border-top">
                            <span class="mb-3 mb-md-0 text-body-secondary">© 2024 - 1128 Holistic Healing</span>
                        </footer>
                    </div>
                </body>
            </html>
        `;
    }

    return {
        service(data: IService) {
            return wrap({
                title: data.meta_title,
                description: data.meta_description,
                content: service(data),
            });
        },
        homepage(data: ISite) {
            return wrap({
                title: 'home page',
                description: 'home page description',
                content: homepage(data),
            });
        }
    }
}