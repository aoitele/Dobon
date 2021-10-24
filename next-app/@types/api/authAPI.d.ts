declare namespace AuthAPIResponse { // eslint-disable-line no-unused-vars
    type UserMe = { // eslint-disable-line no-unused-vars
        id: number;
        nickname: string;
        status: number;
        expired_date: Date;
        last_login: Date;
        created_at: Date;
        updated_at :Date;
    }
}