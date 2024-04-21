export interface IParticipantService {
    createParticipant(data:any,id);
    createNewLuckyHitParticipant(data:any,id);
    order(data:any,id)
    getAllParticipant(data:any)
    getAllParticipantByRoomId(data:any)
    getTotalAmountByRoomId(data:any)
    getTotalAmountByRoomIdForLuckyHit(data:any)
    sendMoneyToAllWinner(data:any)
    sendMoneyToAllWinnerAtLuckeyHit(data:any)
    getAllOrderListByRoomId(data:any)
    orderListByParticipant(data:any,id:any)
}