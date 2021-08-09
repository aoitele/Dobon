
import type { DevidedCardWithStatus } from '../../@types/card'

type ActionType = 
| { type: "toggleOpen" };

const reducer = (state: DevidedCardWithStatus, action: ActionType): DevidedCardWithStatus => {
    console.log(state, 'state')
    switch (action.type) {
        case 'toggleOpen':
            return {
                open:[...state.open],
                close: [...state.close]
            }
        default :
            return state
    }
}

export default reducer