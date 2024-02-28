export enum Routes {
    AUTH = 'auth',
    USERS = 'users', 
}
export enum Services {
    USERS = 'USERS_SERVICE', 
    AUTH = 'AUTH_SERVICE',
    OTP = 'OTP_SERVICE',
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

  export enum Roles{
    SUPERADMIN='SUPERADMIN',
    ADMIN='ADMIN',
    USER='USER'
  }