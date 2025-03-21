import http from "@/lib/http";
import {
    AccountResType,
    CreateAccountType,
    UpdateAccountType,
    AccountListResType,
    AccountFilterType,
} from "@/schemaValidations/accountManagement/account.schema";

const accountApiRequest = {
    getListAccount: (page: number, psize: number, body: AccountFilterType | null) =>
        http.get<AccountListResType>(
            `/api/v1/accounts?page=${page}&psize=${psize}
            ${body?.username ? `&username=${body.username}` : ""}
            ${body?.email ? `&email=${body.email}` : ""}
            ${body?.role ? `&role=${body.role}` : ""}
            ${body?.["created-at-from"] ? `&created-at-from=${body?.["created-at-from"]}` : ""}
            ${body?.["created-at-to"] ? `&created-at-to=${body?.["created-at-to"]}` : ""}
            `
        ),

    createAccount: (body: CreateAccountType) =>
        http.post<AccountResType>("/api/v1/accounts", body),
    
    updateAccount: (body: UpdateAccountType) => {
        const { id, ...updateBody } = body;
        return http.put<AccountResType>(
            `/api/v1/accounts/${body.id}`,
            updateBody
        );
    },

    deleteAccount: (id: string) =>
        http.delete(`/api/v1/accounts/${id}`)
};
export default accountApiRequest;