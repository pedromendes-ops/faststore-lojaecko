export const contentPositions = {
  'left-bottom': {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  'right-bottom': {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  'center-bottom': {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  'top-left': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  'top-right': {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  'top-center': {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  'center-left': {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  'center-right': {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  'center-center': {
    justifyContent: 'center',
    alignItems: 'center',
  },
} as const

export const absolutePositions = {
  'left-bottom': {
    left: '0',
    bottom: '0',
  },

  'right-bottom': {
    right: '0',
    bottom: '0',
  },

  'center-bottom': {
    left: '50%',
    bottom: '0',
    transform: 'translateX(-50%)',
  },

  'top-left': {
    top: '0',
    left: '0',
  },

  'top-right': {
    top: '0',
    right: '0',
  },

  'top-center': {
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  },

  'center-left': {
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
  },

  'center-right': {
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
  },

  'center-center': {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
} as const