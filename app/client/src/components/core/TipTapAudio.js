import { Node } from 'tiptap';

export default class Audio extends Node {
  get name() {
    return 'audio';
  }

  get schema() {
    return {
      attrs: {
        src: {
          default: null
        }
      },
      group: 'block',
      selectable: false,
      parseDOM: [
        {
          tag: 'audio',
          getAttrs: dom => ({
            src: dom.getAttribute('src')
          })
        }
      ],
      toDOM: node => [
        'audio',
        {
          controls: '',
          style: 'width:100%;'
        },
        [
          'source',
          {
            src: node.attrs.src,
            type: 'audio/mpeg'
          }
        ]
      ]
    };
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
    };
  }
}
