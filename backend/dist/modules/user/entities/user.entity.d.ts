export interface UserProps {
    id: string | null;
    name: string;
    email: string;
    role: "user" | "admin" | "salesPerson";
    password?: string | null;
    googleId?: string | null;
    isBlocked?: boolean;
    isVerified?: boolean;
    tokenVersion: number;
}
export declare class User {
    readonly id: string | null;
    readonly name: string;
    readonly email: string;
    readonly role: "admin" | "user" | "salesPerson";
    readonly password: string | null;
    readonly googleId: string | null;
    readonly isVerified: boolean;
    readonly isBlocked: boolean;
    readonly tokenVersion: number;
    constructor(props: UserProps);
    block(): User;
    unblock(): User;
    incrementTokenVersion(): User;
    verify(): User;
    setGoogleId(googleId: string): User;
    changePassword(newHashedPassword: string): User;
}
//# sourceMappingURL=user.entity.d.ts.map