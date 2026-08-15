export type ExpectedUserState = {
    region: string;
    role_id: number;
    is_active: boolean;
};

// * sebelum scenario UI dijalankan. Key HARUS sama persis dengan suffix env var
export const expectedUserState: Record<string, ExpectedUserState> = {
    // USER PUSAT
    HQ_REQUESTER:       { region: 'HQ', role_id: 1, is_active: true },
    HQ_SUPERADMIN:      { region: 'HQ', role_id: 2, is_active: true },
    HQ_ADMIN:           { region: 'HQ', role_id: 3, is_active: true },
    HQ_HEAD_REQUESTER:  { region: 'HQ', role_id: 4, is_active: true },
    HQ_STAFF_ADMIN:     { region: 'HQ', role_id: 5, is_active: true },

    // USER CABANG
    BRANCH_REQUESTER:      { region: 'BRANCH', role_id: 1, is_active: true },
    BRANCH_SUPERADMIN:     { region: 'BRANCH', role_id: 2, is_active: true },
    BRANCH_ADMIN:          { region: 'BRANCH', role_id: 3, is_active: true },
    BRANCH_HEAD_REQUESTER: { region: 'BRANCH', role_id: 4, is_active: true },
    BRANCH_STAFF_ADMIN:    { region: 'BRANCH', role_id: 5, is_active: true },
};