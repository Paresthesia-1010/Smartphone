
(function () {
  'use strict';
  window.NeoIG = window.NeoIG || {};

  const React = window.React;
  const h = React.createElement;

  function createSvgIcon(paths, viewBox = '0 0 24 24', defaultFill = 'none', defaultStroke = 'currentColor', strokeWidth = 2) {
    return function IconComponent(props) {
      const p = props || {};
      const size = p.size || 22;
      const color = p.color || defaultStroke;
      const fill = p.fill || defaultFill;

      return h('svg', {
        viewBox: viewBox,
        width: size,
        height: size,
        fill: fill,
        stroke: color,
        strokeWidth: strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: p.className || '',
        style: p.style || {}
      }, paths);
    };
  }

  window.NeoIG.Icons = {
    
    Home: createSvgIcon([
      h('path', { key: '1', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { key: '2', points: '9 22 9 12 15 12 15 22' })
    ]),
    Search: createSvgIcon([
      h('circle', { key: '1', cx: '11', cy: '11', r: '8' }),
      h('line', { key: '2', x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    ], '0 0 24 24', 'none', 'currentColor', 2.4),
    DM: createSvgIcon([
      h('polygon', { key: '1', points: '22 2 15 22 11 13 2 9 22 2' })
    ]),

    
    Heart: createSvgIcon([
      h('path', { key: '1', d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' })
    ]),
    HeartFilled: createSvgIcon([
      h('path', { key: '1', d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })
    ], '0 0 24 24', '#ef4444', '#ef4444', 0),
    Comment: createSvgIcon([
      h('path', { key: '1', d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' })
    ]),
    Share: createSvgIcon([
      h('polygon', { key: '1', points: '22 2 15 22 11 13 2 9 22 2' })
    ]),
    Bookmark: createSvgIcon([
      h('path', { key: '1', d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' })
    ]),
    More: createSvgIcon([
      h('circle', { key: '1', cx: '12', cy: '12', r: '1.5' }),
      h('circle', { key: '2', cx: '6', cy: '12', r: '1.5' }),
      h('circle', { key: '3', cx: '18', cy: '12', r: '1.5' })
    ], '0 0 24 24', 'currentColor', 'currentColor', 0),

    
    Back: createSvgIcon([
      h('polyline', { key: '1', points: '15 18 9 12 15 6' })
    ], '0 0 24 24', 'none', 'currentColor', 2.5),
    Close: createSvgIcon([
      h('line', { key: '1', x1: '18', y1: '6', x2: '6', y2: '18' }),
      h('line', { key: '2', x1: '6', y1: '6', x2: '18', y2: '18' })
    ], '0 0 24 24', 'none', 'currentColor', 2.4),
    Plus: createSvgIcon([
      h('line', { key: '1', x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('line', { key: '2', x1: '5', y1: '12', x2: '19', y2: '12' })
    ]),
    Edit: createSvgIcon([
      h('path', { key: '1', d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
      h('path', { key: '2', d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
    ]),
    Camera: createSvgIcon([
      h('path', { key: '1', d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' }),
      h('circle', { key: '2', cx: '12', cy: '13', r: '4' })
    ]),
    AvatarPlaceholder: createSvgIcon([
      h('path', { key: '1', d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { key: '2', cx: '12', cy: '7', r: '4' })
    ]),
    Call: createSvgIcon([
      h('path', { key: '1', d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
    ], '0 0 24 24', 'currentColor', 'currentColor', 0),
    ChevronRight: createSvgIcon([
      h('polyline', { key: '1', points: '9 18 15 12 9 6' })
    ], '0 0 24 24', 'none', 'currentColor', 2.4),
    Link: createSvgIcon([
      h('path', { key: '1', d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
      h('path', { key: '2', d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })
    ]),
    XLogo: createSvgIcon([
      h('path', { key: '1', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })
    ], '0 0 24 24', 'currentColor', 'none', 0)
  };
})();