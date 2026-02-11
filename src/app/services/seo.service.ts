import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(private title: Title, private meta: Meta) { }

    setSeoData(title: string, description: string, keywords: string) {
        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keywords });

        // Open Graph / Facebook
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });

        // Twitter
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    updateTitle(title: string) {
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    updateDescription(description: string) {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ name: 'twitter:description', content: description });
    }
}
