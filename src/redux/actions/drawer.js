export const TOGGLE_LEFTDRAWER = 'TOGGLE_LEFTDRAWER';




export function toggleLeftDrawer() {
    console.log('action toggled')
    return { type: TOGGLE_LEFTDRAWER }
}

