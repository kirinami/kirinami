export type Head = {
  language?: {
    locale: string;
    dir: 'ltr' | 'rtl';
  };
  title?: string;
  description?: string;
  keywords?: string;
};

export type Tag = {
  group: keyof Head;
  name: 'html' | 'title' | 'meta';
  key: string;
  attributes: {
    [name: string]: string;
  };
  content?: string;
};

export type Schema = {
  html: Tag;
  title: Tag;
  meta: Tag[];
};

const schema: Schema = {
  html: {
    group: 'language',
    name: 'html',
    key: '',
    attributes: {
      lang: '$locale',
      dir: '$dir',
    },
  },

  title: {
    group: 'title',
    name: 'title',
    key: '',
    attributes: {},
    content: '$',
  },

  meta: [
    {
      group: 'title',
      name: 'meta',
      key: 'name',
      attributes: {
        name: 'title',
        content: '$',
      },
    },
    {
      group: 'title',
      name: 'meta',
      key: 'property',
      attributes: {
        property: 'og:title',
        content: '$',
      },
    },
    {
      group: 'title',
      name: 'meta',
      key: 'name',
      attributes: {
        name: 'twitter:title',
        content: '$',
      },
    },

    {
      group: 'description',
      name: 'meta',
      key: 'name',
      attributes: {
        name: 'description',
        content: '$',
      },
    },
    {
      group: 'description',
      name: 'meta',
      key: 'property',
      attributes: {
        property: 'og:description',
        content: '$',
      },
    },
    {
      group: 'description',
      name: 'meta',
      key: 'name',
      attributes: {
        name: 'twitter:description',
        content: '$',
      },
    },

    {
      group: 'keywords',
      name: 'meta',
      key: 'name',
      attributes: {
        name: 'keywords',
        content: '$',
      },
    },
  ],
};

function resolveValue(group: Head[keyof Head], ref?: string): string {
  if (!group || !ref) {
    return '';
  }

  if (ref.startsWith('$')) {
    return typeof group === 'object' && !Array.isArray(group)
      ? group[ref.slice(1) as keyof typeof group] || ''
      : group.toString();
  }

  return ref;
}

export function headToDom(head: Head) {
  const applyToElement = (tag: Tag, group: Head[keyof Head], element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    Object.entries(tag.attributes).forEach(([key, ref]) => {
      element.setAttribute(key, resolveValue(group, ref));
    });

    if (tag.content != null) {
      const value = resolveValue(group, tag.content);

      if (element.innerText !== value) {
        element.innerText = value;
      }
    }
  };

  applyToElement(schema.html, head.language, document.querySelector('html'));
  applyToElement(schema.title, head.title, document.querySelector('title'));

  schema.meta.forEach((tag) => {
    let element = document.querySelector<HTMLMetaElement>(`meta[${tag.key}="${tag.attributes[tag.key]}"]`);

    const group = head[tag.group];

    if (!group) {
      if (element) {
        document.head.removeChild(element);
      }

      return;
    }

    if (!element) {
      element = document.head.appendChild(document.createElement('meta'));
    }

    applyToElement(tag, group, element);
  });
}

export function headToJson(head: Head) {
  const stringifyAttributes = (attributes: Tag['attributes'], group: Head[keyof Head]) => {
    if (!group) {
      return '';
    }

    return Object.entries(attributes)
      .map(([key, ref]) => `${key}="${resolveValue(group, ref)}"`)
      .join(' ');
  };

  const html = `<html ${stringifyAttributes(schema.html.attributes, head.language)}>`;

  const title = `<title ${stringifyAttributes(schema.title.attributes, head.title)}>${resolveValue(
    head.title,
    schema.title.content,
  )}</title>`;

  const meta = schema.meta
    .filter((tag) => !!head[tag.group])
    .map((tag) => `<meta ${stringifyAttributes(tag.attributes, head[tag.group])} />`);

  return {
    html,
    title,
    meta,
  };
}

export function resolveHead(curr: Head, next: Head): Head {
  return {
    language: next.language || curr.language,
    title: next.title || undefined,
    description: next.description || undefined,
    keywords: next.keywords || undefined,
  };
}
