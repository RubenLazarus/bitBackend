export interface IParticipantService {
    createParticipant(data:any,id);
    order(data:any,id)
    getAllParticipant(data:any)
    getAllParticipantByRoomId(data:any)
    getTotalAmountByRoomId(data:any)
    sendMoneyToAllWinner(data:any)
    orderListByParticipant(data:any,id:any)
}