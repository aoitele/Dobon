import { EmitCard, EmitAction, EmitChat } from "../../@types/socket"
import hasProperty from './hasProperty'

const useEmitDataType = (arg:unknown) => {
    if (hasProperty(arg, 'data')) {
        return arg.data.type ? arg.data.type : false;
    }
    return false
}

const isEmitCard = (arg:unknown):arg is EmitCard => useEmitDataType(arg) === 'card';
const isEmitAction = (arg:unknown):arg is EmitAction => useEmitDataType(arg) === 'action';
const isEmitChat = (arg:unknown):arg is EmitChat => useEmitDataType(arg) === 'chat';

export {isEmitCard, isEmitAction, isEmitChat}
