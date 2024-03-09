export enum Routes {
    AUTH = 'auth',
    USERS = 'users', 
    GAME = 'game', 
    ROOM = 'room', 
    PARTICIPANT = 'participant', 
}
export enum Services {
    USERS = 'USERS_SERVICE', 
    AUTH = 'AUTH_SERVICE',
    OTP = 'OTP_SERVICE',
    GAME = 'GAME_SERVICE',
    ROOM = 'ROOM_SERVICE',
    PARTICIPANT = 'PARTICIPANT_SERVICE',
    GATEWAY_SESSION_MANAGER='GATEWAY_SESSION_MANAGER'
}
export enum Prioriyt {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'Hign',
    URGENT="Urgent"
  }
export enum Status {
    PENDING = 'pending',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
    RE_OPEN="Re Open"
  }
export enum roomStatus {
    UPCOMING = 'Upcoming',
    CONTINUE = 'Continue',
    COMPLEDTED = 'Completed',
  }

  export enum Roles{
    SUPERADMIN='SUPERADMIN',
    ADMIN='ADMIN',
    USER='USER'
  }
  export enum COLOR{
    RED='Red',
    BLUE='Blue',
    GREEN='Green'
  }