/**
 * 
 * Mambu api dao
 * 
 * You must create instance of this class with credentials.
 */
import * as request from 'request';
import { Logger } from '../app/Logger';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';
import { mapFields, unmapFields } from '../helpers/mapper';
import { enumMappingFromMambuCustomFieldInfo } from '../helpers/enums';

export interface MambuClientAddress {
    encodedKey?: string;
    parentKey?: string;

    address?: string; // line1?: string;
    addressOptional?: string; // line2?: string;
    addressCity?: string; // city?: string;
    addressPostcode?: string; // postcode?: string;
    addressLGA?: string; // region?: string;
    addressState?: string; // country?: string;

    indexInList?: number;
};

// Structures
export interface MambuClient {
    // mapped
    zenooPlatformOriginated?: string;
    channel?: string;
    mobilePhone?: string; //    mobilePhone1?: string;
    BVN?: string;
    SMSCode?: string;
    SMSVerifiedUntil?: string;
    residencyTimeYears?: number;
    residencyTimeMonths?: number;
    residentialStatus?: string;
    educationStatus?: string;
    employerKey?: string;
    employerName?: string;
    employerIndustry?: string;
    employerEmail?: string;
    employerAddress?: string;
    employerAddressOptional?: string;
    employerAddressCity?: string;
    employerAddressState?: string;
    employerAddressLGA?: string;
    employmentStatus?: string;
    employmentDate?: string;
    agreedGeneralTerms?: boolean;
    agreedPrivacyPolicy?: boolean;
    campaignSource?: string;
    campaignName?: string;
    campaignMedium?: string;
    campaignTerm?: string;
    campaignContent?: string;
    verifiedMobilePhone?: string;
    identificationDocumentType?: string;
    addressState?: string;
    addressLGA?: string;

    facematchBVNSelfieSimilarity?: number;
    facematchBVNIDSimilarity?: number;
    facematchSelfieIDSimilarity?: number;

    paystackDate?: string;
    paystackTime?: string;
    paystackCardType?: string;
    paystackMaskedCardNumber?: string;
    paystackCardExpiry?: string;
    paystackAccountName?: string;
    paystackBankName?: string;
    paystackAuthCode?: string;
    paystackCardProcessor?: 'Paystack';

    emailAddressCopy?: string;

    businessNature?: string;
    numberOfEmployees?: string;
    numberOfBanks?: string;
    bank1?: string;
    bank2?: string;
    bank3?: string;
    bank4?: string;
    bank5?: string;
    accountOpeningDate?: string;

    salaryDate1?: string;
    salaryDate2?: string;
    salaryDate3?: string;
    salaryDate4?: string;
    salaryDate5?: string;
    salaryDate6?: string;
    salaryAmount1?: string;
    salaryAmount2?: string;
    salaryAmount3?: string;
    salaryAmount4?: string;
    salaryAmount5?: string;
    salaryAmount6?: string;

    id?: string;
    creationDate?: string;
    lastModifiedDate?: string;
    activationDate?: string;
    firstName?: string;
    lastName?: string;
    encodedKey?: string;
    assignedUserKey?: string;
    middleName?: string;
    homePhone?: string;
    state?: string;
    // mobilePhone2?: string;
    gender?: "MALE" | "FEMALE";
    emailAddress?: string;
    birthDate?: string;
    notes?: string;
    assignedBranchKey?: string;
    assignedCentreKey?: string;
    clientRole?: any;
    preferredLanguage?: string;

    address?: MambuClientAddress;
    // [customKey: string]: any; // custom fields

    errorBVN?: 'Yes'|'No';
    errorFacematchSelfie?: 'Yes'|'No';
    errorFacematchIDCard?: 'Yes'|'No';

    grouped_set_field_one?: string;
    grouped_set_field_two?: string;
    grouped_set_2_one?: string;
    grouped_set_2_two?: string;

    fraudHuntScore?: string;
    fraudHuntKey?: string;

    salesAgent?: string;
    salesTeamLead?: string;

    isPEP?: string;
}

export interface MambuTask {
    encodedKey?: string;
    id?: number;
    creationDate?: string;
    lastModifiedDate?: string;
    dueDate?: string;
    title?: string;
    description?: string;
    createdByUserKey?: string;
    status?: string;
    daysUntilDue?: number;
    createdByFullName?: string;
    assignedUserKey?: string;
}

export interface MambuResponse {
    returnCode: number;
    returnStatus: string;
}

export interface MambuLoan {
    encodedKey?: string;
    id?: string;
    accountHolderKey?: string;
    productTypeKey?: string;
    accountHolderType?: string;
    loanAmount?: string;
    repaymentInstallments?: number;
    interestRate?: string;
    creationDate?: string;
    accountState?: string;
    gracePeriod?: number;
    // customInformation?: {value: string; customFieldID: string}[];

    // mapped:
    loanPurpose?: string;
    loanAccounts?: string;
    signSMSCode?: string;
    signDate?: string;
    signTime?: string;
    signMobilePhone?: string;
    signJSON?: string;

    bankAccountType?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    bankAccountNameCopy?: string;
    paymentMethod?: string;

    gdsInitial?: string;
    gdsFinal?: string;

    loanAmountModified?: string;
    loanTermModified?: string;
    loanAmountRequested?: string;

    errorGDSInitial?: 'Yes'|'No';
    errorGDSFinal?: 'Yes'|'No';
    errorMBS?: 'Yes'|'No';
    errorCreditCheck?: 'Yes'|'No';
    errorPayout?: 'Yes'|'No';

    consolidationLenderName1?: string;
    consolidationBankName1?: string;
    consolidationAccountNumber1?: string;
    consolidationReference1?: string;
    consolidationMonthlyPaymentAmount1?: string;
    consolidationLoanAmount1?: string;
    consolidationOutstandingAmount1?: string;
    consolidationLenderName2?: string;
    consolidationBankName2?: string;
    consolidationAccountNumber2?: string;
    consolidationReference2?: string;
    consolidationMonthlyPaymentAmount2?: string;
    consolidationLoanAmount2?: string;
    consolidationOutstandingAmount2?: string;
    consolidationLenderName3?: string;
    consolidationBankName3?: string;
    consolidationAccountNumber3?: string;
    consolidationReference3?: string;
    consolidationMonthlyPaymentAmount3?: string;
    consolidationLoanAmount3?: string;
    consolidationOutstandingAmount3?: string;
    consolidationLenderName4?: string;
    consolidationBankName4?: string;
    consolidationAccountNumber4?: string;
    consolidationReference4?: string;
    consolidationMonthlyPaymentAmount4?: string;
    consolidationLoanAmount4?: string;
    consolidationOutstandingAmount4?: string;

}

export interface MambuLoanRepayment {
    encodedKey?: string;
    parentAccountKey?: string;
    dueDate?: string;
    principalDue?: string;
    principalPaid?: string;
    interestDue?: string;
    interestPaid?: string;
    feesDue?: string;
    feesPaid?: string;
    penaltyDue?: string;
    penaltyPaid?: string;
    state?: string,
    taxInterestDue?: string;
    taxInterestPaid?: string;
    taxFeesDue?: string;
    taxFeesPaid?: string;
    taxPenaltyDue?: string;
    taxPenaltyPaid?: string;
    customSettings?: any[];
}

export interface MambuLoanproduct {
    encodedKey: string;
    id: string;
    creationDate: string
    lastModifiedDate: string;
    productName: string;
    productDescription: string;
    loanProductType: string;
    defaultLoanAmount: string;
    minLoanAmount: string;
    maxLoanAmount: string;
    maxNumberOfDisbursementTranches: number;
    idGeneratorType: string;
    idPattern: string;
    accountInitialState: string;
    activated: boolean;
    repaymentScheduleMethod: string;
    scheduleDueDatesMethod: string;
    defaultRepaymentPeriodCount: number;
    repaymentPeriodUnit: string;
    minNumInstallments: number;
    maxNumInstallments: number;
    defaultNumInstallments: number;
    gracePeriodType: string;
    defaultGracePeriod: number;
    defaultPrincipalRepaymentInterval: number;
    roundingRepaymentScheduleMethod: string;
    repaymentCurrencyRounding: string;
    repaymentElementsRoundingMethod: string;
    paymentMethod: string;
    amortizationMethod: string;
    latePaymentsRecalculationMethod: string;
    prepaymentAcceptance: string;
    futurePaymentsAcceptance: string;
    repaymentAllocationOrder: string[]
    interestCalculationMethod: string;
    interestRateSettings: {
        defaultInterestRate: string;
        minInterestRate: string;
        encodedKey: string;
        interestChargeFrequency: string;
        interestRateSource: string;
        interestRateTerms: string
        interestRateTiers: any[]
    }
    interestType: string;
    interestBalanceCalculationMethod: string;
    interestApplicationMethod: string;
    daysInYear: string;
    scheduleInterestDaysCountMethod: string;
    loanPenaltyCalculationMethod: string;
    loanPenaltyGracePeriod: number;
    arrearsSettings: {
        encodedKey: string;
        defaultTolerancePeriod: number;
        minTolerancePeriod: number;
        maxTolerancePeriod: number;
        dateCalculationMethod: string;
        nonWorkingDaysMethod: string;
    },
    loanFees: {
        encodedKey: string;
        name: string;
        amount: string;
        amountCalculationMethod: string;
        trigger: string;
        feeApplication: string;
        active: boolean;
        amortizationProfile: string;
        feeProductRules: any[];
    }[],
    allowArbitraryFees: boolean
    accountingMethod: string;
    loanProductRules: any[];
    interestAccruedAccountingMethod: string;
    accountLinkingEnabled: boolean;
    autoLinkAccounts: boolean;
    autoCreateLinkedAccounts: boolean;
    settlementOptions: string;
    repaymentScheduleEditOptions: any[];
    taxesOnInterestEnabled: boolean;
    taxesOnFeesEnabled: boolean;
    taxesOnPenaltyEnabled: boolean;
    cappingApplyAccruedChargesBeforeLocking: boolean;
    lineOfCreditRequirement: string;
    forIndividuals: boolean;
    forPureGroups: boolean;
    forHybridGroups: boolean;
    forAllBranches: boolean;
    availableProductBranches: any[];
    repaymentReschedulingMethod: string;
}

export interface MambuDeposit {
    encodedKey?: string;
    id?: string;
    accountHolderKey?: string;
    accountHolderType?: string;
    name?: string;
    creationDate?: string;
    approvedDate?: string;
    activationDate?: string;
    lastModifiedDate?: string;
    lastInterestCalculationDate?: string;
    lastAccountAppraisalDate?: string;
    productTypeKey?: string;
    accountType?: string;
    accountState?: string;
    balance?: number;
    accruedInterest?: string;
    overdraftInterestAccrued?: string;
    overdraftAmount?: string;
    interestDue?: string;
    feesDue?: string;
    allowOverdraft?: boolean;
    allowTechnicalOverdraft?: boolean;
    notes?: string;
    interestPaymentPoint?: string;
    interestPaymentDates?: {
        dayOfMonth?: number;
        monthOfYear?: number;
        year?: number;
    }[];
    interestSettings?: {
        interestRate?: number;
        encodedKey?: string;
        interestChargeFrequency?: string;
        interestChargeFrequencyCount?: number;
        interestRateSource?: string;
        interestRateTerms?: string;
        interestRateTiers?: any[];
        accrueInterestAfterMaturity?: boolean;
    },
    maturityDate?: any;
    savingsAccount?: any;
    depositTenor?: number;
    referral?: string;
    brokerDepositAccounts?: string;
}

export interface MambuDepositproduct {
    encodedKey: string;
    id: string;
    name: string;
    creationDate: string;
    lastModifiedDate: string;
    forGroups: boolean;
    forIndividuals: boolean;
    forAllBranches: boolean;
    productType: string;
    interestPaidIntoAccount: boolean;
    interestRateSettings: {
        defaultInterestRate: string;
        minInterestRate: string;
        maxInterestRate: string;
        encodedKey: string;
        interestChargeFrequency: string;
        interestChargeFrequencyCount: number;
        interestRateSource: string;
        interestRateTerms: string;
        interestRateTiers: any[];
        accrueInterestAfterMaturity: boolean;
    },
    interestCalculationBalance: string;
    activated: boolean;
    interestPaymentPoint: string;
    collectInterestWhenLocked: boolean;
    minOpeningBalance: string;
    minMaturityPeriod: number;
    maxMaturityPeriod: number;
    defaultMaturityPeriod: number;
    interestDaysInYear: string;
    maxOverdraftLimit: string;
    allowOverdraft: boolean;
    allowTechnicalOverdraft: boolean;
    maturityPeriodUnit: string;
    description: string;
    savingsFees: {
        encodedKey: string;
        name: string;
        amountCalculationMethod: string;
        trigger: string;
        feeApplication: string;
        active: boolean;
        creationDate: string;
        amortizationProfile: string;
        feeAmortizationUponRescheduleOption: string;
        feeProductRules: any[];
    }[];
    allowArbitraryFees: boolean;
    idGeneratorType: string;
    idPattern: string;
    accountingMethod: string;
    savingsProductRules: any[];
    interestAccruedAccountingMethod: string;
    allowOffset: boolean;
    withholdingTaxEnabled: boolean;
    templates: any[];
    currencies: {
        code: string;
        name: string;
        symbol: string;
        digitsAfterDecimal: number;
        currencySymbolPosition: string;
        isBaseCurrency: boolean;
        creationDate: string;
        lastModifiedDate: string;
    }[];
    availableProductBranches: any[];
}

export interface MambuAttachment {
    encodedKey?: string;
    id?: number;
    creationDate?: string;
    lastModifiedDate?: string;
    documentHolderKey?: string;
    documentHolderType?: "CLIENT";
    name?: string;
    type?: string;
    fileSize?: number;
    originalFilename: string;
    location?: string;
    createdByUserKey?: string;
    userName?: string;
}

export interface MambuAttachmentContent{
    content: string;
}

export interface MambuInputFile {
    filename: string;
    filetype: string;
    content: string;
}

export interface MambuComment {
    encodedKey?: string;
    parentKey?: string;
    userKey?: string;
    creationDate?: string;
    lastModifiedDate?: string;
    text: string;
}

export interface MambuGroupAddress {
    encodedKey?: string;
    parentKey?: string;

    address?: string; // line1?: string;
    addressOptional?: string; // line2?: string;
    addressCity?: string; // city?: string;
    addressPostcode?: string; // postcode?: string;
    addressLGA?: string; // region?: string;
    addressState?: string; // country?: string;

    indexInList?: number;
};

export interface MambuGroup {
    encodedKey?: string;
    id?: string;
    creationDate?: string;
    lastModifiedDate?: string;
    groupName?: string;
    notes?: string;
    assignedUserKey?: string;
    assignedBranchKey?: string;
    loanCycle?: string;
    emailAddress?: string;

    // address
    address?: MambuGroupAddress;

    // mapped
    industry?: string;
    
    defaultPayDate?: 'Date';
    defaultPayrollDay?: '30';
    defaultWeekendRuleSat?: '0';
    defaultWeekendRuleSun?: '0';
    defaultPublicHolidayRule?: '0';
}

export interface MambuCustomFieldInfo {
    customFieldSelectionOptions?: { encodedKey: string; value: string; constraint?: { value: string } }[];
    [customKey: string]: any;
}

// Service
export interface MambuConfig extends BasicAuthCredentials {
    url: string;
    robotUserKey: string;
    officerUserKey: string;
    branchKey: string;
    groupedNames: string[][];
    clientRole: string;
    useMockupFieldsInfo: boolean;
    mockupFieldsInfo: MambuCustomFieldInfo;
}

/**
 * Service for communication with mambu by rest api
 */
export class MambuService {

    // Standart fields of client structure.
    protected static clientStandartFields = [
        "id",
        "firstName",
        "lastName",
        "encodedKey",
        "assignedUserKey",
        "middleName",
        "homePhone",
        "mobilePhone1",
        "mobilePhone2",
        "gender",
        "emailAddress",
        "birthDate",
        "notes",
        "assignedBranchKey",
        "assignedCentreKey",
        "clientRole",
        "preferredLanguage",
        "address",
        "state",
    ];

    // map clients fields
    protected static clientsFieldsMap = {

        // POST /client
        CustomerID_Clients: "BVN",
        mobilePhone1: "mobilePhone",
        auth_email: "emailAddressCopy",
        agreedGeneralTerms: "agreedGeneralTerms",
        agreedPrivacyPolicy: "agreedPrivacyPolicy",
        campaignSource: "campaignSource",
        campaignName: "campaignName",
        campaignMedium: "campaignMedium",
        campaignTerm: "campaignTerm",
        campaignContent: "campaignContent",
        Zenoo_platform_originated: "zenooPlatformOriginated",
        Channel_Clients: "channel",
        Sales_Agent: "salesAgent",
        Sales_Team_Lead_Clients: "salesTeamLead",
        // POST /client [depositFlow]
        homePhone: "homePhone",
        PEP_Yes: "isPEP",
        
        // PATCH /client [step=basicInfo]
        res_years_at_current_residence: "residencyTimeYears",
        res_months_at_current_residence: "residencyTimeMonths",
        res_residential_status: "residentialStatus",
        Education_Status_Clients: "educationStatus",
        Address_State_Clients: "addressState",
        Address_LGA_2_Clients: "addressLGA",
        // clientAddress in address
        
        // PATCH /client [step=employmentInfo]
        Employer_Link_Clients: "employerKey",
        employer_name_temp: "employerName",
        emp_employment_industry: "employerIndustry",
        Address_Line_1_Clients: "employerAddress",
        Address_Line_2_Clients: "employerAddressOptional",
        City_Clients: "employerAddressCity",
        Employer_State_Clients: "employerAddressState",
        Employer_LGA_2_Clients: "employerAddressLGA",
        emp_employment_status: "employmentStatus",
        emp_date_of_employment: "employmentDate",
        client_work_email: "employerEmail",

        // PATCH /client [step=selfEmploymentInfo]
        Business_Sector_Clients: "businessNature",
        Number_of_Employees_Clients: "numberOfEmployees",
        Number_of_Bank_Accts_Clients: "numberOfBanks",
        Bank_1_Clients: "bank1",
        Bank_2_Clients: "bank2",
        Bank_3_Clients: "bank3",
        Bank_4_Clients: "bank4",
        Bank_5_Clients: "bank5",
        Account_Opening_Date: "accountOpeningDate",

        // PATCH /client [step=salaryInfo]
        SAL_DTE_001: "salaryDate1",
        SAL_DTE_002: "salaryDate2",
        SAL_DTE_003: "salaryDate3",
        SAL_DTE_004: "salaryDate4",
        SAL_DTE_005: "salaryDate5",
        SAL_DTE_006: "salaryDate6",
        SAL_AMT_001: "salaryAmount1",
        SAL_AMT_002: "salaryAmount2",
        SAL_AMT_003: "salaryAmount3",
        SAL_AMT_004: "salaryAmount4",
        SAL_AMT_005: "salaryAmount5",
        SAL_AMT_006: "salaryAmount6",

        // PUT /client/verification-code
        verified_mobile_number: "verifiedMobilePhone",

        // POST /client/files
        identification_document_type: "identificationDocumentType",

        // POST /validate/facematch/?
        facematch_bvn_selfie_similarity: "facematchBVNSelfieSimilarity",
        facematch_bvn_id_similarity: "facematchBVNIDSimilarity",
        facematch_selfie_id_similarity: "facematchSelfieIDSimilarity",

        // all endpoints
        middleware_sms_code: "SMSCode",
        middleware_sms_verified_until: "SMSVerifiedUntil",

        // POST /validate/paystack
        gp_card_token_date: "paystackDate",
        gp_card_token_time: "paystackTime",
        gp_card_type: "paystackCardType",
        gp_masked_card_number: "paystackMaskedCardNumber",
        gp_card_expiry_date: "paystackCardExpiry",
        gp_account_name: "paystackAccountName",
        bank_name_debit_card: "paystackBankName",
        auth_code: "paystackAuthCode",
        card_processor: "paystackCardProcessor",

        // POST /validate/fraud-hunt
        zenooScore: "fraudHuntScore",
        zenooKey: "fraudHuntKey",

        // errors
        BVN_Error_Clients: "errorBVN",
        AWS_Selfie_Error_Clients: "errorFacematchSelfie",
        AWS_ID_Card_Error_Clients: "errorFacematchIDCard",
    };

    public static clientsAddressFieldsMap = {
        // PATCH /client [step=basicInfo]
        line1: "address",
        line2: "addressOptional",
        city: "addressCity",
        region: "addressLGA",
        postcode: "addressPostcode",
        country: "addressState",
    };

    public static loanStandartFields = [
        "encodedKey",
        "id",
        "accountHolderKey",
        "accountHolderType",
        "creationDate",
        "lastModifiedDate",
        "accountState",
        "productTypeKey",
        "loanName",
        "loanAmount",
        "periodicPayment",
        "tranches",
        "principalDue",
        "principalPaid",
        "principalBalance",
        "redrawBalance",
        "interestDue",
        "interestPaid",
        "interestFromArrearsBalance",
        "interestFromArrearsDue",
        "interestFromArrearsPaid",
        "interestBalance",
        "feesDue",
        "feesPaid",
        "feesBalance",
        "penaltyDue",
        "penaltyPaid",
        "penaltyBalance",
        "scheduleDueDatesMethod",
        "prepaymentAcceptance",
        "futurePaymentsAcceptance",
        "hasCustomSchedule",
        "repaymentPeriodCount",
        "repaymentPeriodUnit",
        "repaymentInstallments",
        "gracePeriod",
        "gracePeriodType",
        "defaultGracePeriod",
        "interestRate",
    ];

    // map loans fields
    protected static loanFieldsMap = {
        loan_purpose: "loanPurpose",
        Loan_Type_Loan_Accounts: "loanAccounts",
        contract_signed_sms_code: "signSMSCode",
        contract_signed_date: "signDate",
        contract_signed_time: "signTime",
        contract_signed_num: "signMobilePhone",
        contract_signed_json: "signJSON",

        InitialDecision_Loan_Accounts: "gdsInitial",
        FinalDecision_Loan_Accounts: "gdsFinal",
        
        CounterOffer1Value_Loan_Accounts: "loanAmountModified",
        CounterOffer1Term_Loan_Accounts: "loanTermModified",

        Requested_Loan_Amount_Loan_Accou: "loanAmountRequested",

        // PATCH /client [step=bankInfo]
        Beneficiary_Account_Type_Loan_Ac: "bankAccountType",
        Beneficiary_Account_Number_Loan_: "bankAccountNumber",
        bank_name: "bankAccountName",
        Repayment_Bank_Loan_Accounts: "bankAccountNameCopy",
        Repayment_Method_Loan_Accounts: "paymentMethod",

        // PATCH /client [step=consolidationLoan1-consolidationLoan4]
        Lender_Name_1: "consolidationLenderName1",
        Bank_Name_1: "consolidationBankName1",
        Account_Number_1: "consolidationAccountNumber1",
        Reference_1: "consolidationReference1",
        Monthly_Payment_Amount_1: "consolidationMonthlyPaymentAmount1",
        Loan_Amount_1: "consolidationLoanAmount1",
        Outstanding_Amount_1: "consolidationOutstandingAmount1",
        Lender_Name_2: "consolidationLenderName2",
        Bank_Name_2: "consolidationBankName2",
        Account_Number_2: "consolidationAccountNumber2",
        Reference_2: "consolidationReference2",
        Monthly_Payment_Amount_2: "consolidationMonthlyPaymentAmount2",
        Loan_Amount_2: "consolidationLoanAmount2",
        Outstanding_Amount_2: "consolidationOutstandingAmount2",
        Lender_Name_3: "consolidationLenderName3",
        Bank_Name_3: "consolidationBankName3",
        Account_Number_3: "consolidationAccountNumber3",
        Reference_3: "consolidationReference3",
        Monthly_Payment_Amount_3: "consolidationMonthlyPaymentAmount3",
        Loan_Amount_3: "consolidationLoanAmount3",
        Outstanding_Amount_3: "consolidationOutstandingAmount3",
        Lender_Name_4: "consolidationLenderName4",
        Bank_Name_4: "consolidationBankName4",
        Account_Number_4: "consolidationAccountNumber4",
        Reference_4: "consolidationReference4",
        Monthly_Payment_Amount_4: "consolidationMonthlyPaymentAmount4",
        Loan_Amount_4: "consolidationLoanAmount4",
        Outstanding_Amount_4: "consolidationOutstandingAmount4",

        // errors
        GDS_Initial_Call_Error_Loan_Acco: "errorGDSInitial",
        GDS_Final_Call_Error_Loan_Accoun: "errorGDSFinal",
        MBS_Error_Loan_Accounts: "errorMBS",
        Credit_Bureau_Error_Loan_Account: "errorCreditCheck",
        Payout_Error_Loan_Accounts: "errorPayout",

    };

    public static depositStandartFields = [
        "encodedKey",
        "id",
        "accountHolderKey",
        "accountHolderType",
        "name",
        "creationDate",
        "activationDate",
        "lastModifiedDate",
        "lastInterestCalculationDate",
        "lastAccountAppraisalDate",
        "productTypeKey",
        "accountType",
        "accountState",
        "balance",
        "accruedInterest",
        "overdraftInterestAccrued",
        "overdraftAmount",
        "interestDue",
        "feesDue",
        "allowOverdraft",
        "allowTechnicalOverdraft",
        "notes",
        "interestPaymentPoint",
        "interestPaymentDates",
        "interestSettings",
        "maturityDate",
    ];

    // map deposit fields
    protected static depositFieldsMap = {
        Staff_Introducer_Deposit_Account: "referral",
        Broker_Deposit_Accounts: "brokerDepositAccounts",
        Deposit_tenor: "depositTenor",
    };


    public static groupAddressFieldsMap = {
        line1: "address",
        line2: "addressOptional",
        city: "addressCity",
        region: "addressLGA",
        postcode: "addressPostcode",
        country: "addressState",
    };

    public static groupStandartFields = [
        "encodedKey",
        "id",
        "creationDate",
        "lastModifiedDate",
        "groupName",
        "notes",
        "assignedUserKey",
        "assignedBranchKey",
        "loanCycle",
        "address",
        "emailAddress",
    ];

    // map loans fields
    protected static groupFieldsMap = {
        Company_Industry_Companies: 'industry',

        'Pay_Date_Companies': 'defaultPayDate',
        'Payroll_Day_Companies': 'defaultPayrollDay',
        'Weekend_Rule_-_Sat_Companies': 'defaultWeekendRuleSat',
        'Weekend_Rule_-_Sun_Companies': 'defaultWeekendRuleSun',
        'Public_Holiday_Rule_Companies': 'defaultPublicHolidayRule',
    };

    /**
     * Creates MambuService with credentials and url
     *
     * @param config configuration for mambu usage
     */
    constructor(protected config: MambuConfig) {}

    /******************************************************
     * Public api methods
     ******************************************************/

    /**
     * POST clients - creates new user
     * Method w∂ill return promise with new client structure, or throws error, if fails
     *
     * @param client new client structure
     */
    public postClient(client: MambuClient): Promise<MambuClient> {
        const nclient = {
            ...MambuService.extractCustomField('client', unmapFields(client, MambuService.clientsFieldsMap), MambuService.clientStandartFields, [], this.config.groupedNames, true),
        };

        // add user key
        nclient.client.assignedUserKey = this.config.officerUserKey;
        nclient.client.assignedBranchKey = this.config.branchKey;

        // delete address from client
        if (nclient.client.address) {
            delete nclient.client.address
        }

        // add address to root
        if (client.address) {
            nclient.addresses = [
                unmapFields(client.address, MambuService.clientsAddressFieldsMap)
            ];
        }

        // if environment needs client role, use it
        if (this.config.clientRole) {
            nclient.client.clientRole = {
                encodedKey: this.config.clientRole
            };
        }

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/clients/', 201, nclient)
            .then((result) => {
                if (!(result.body && result.body.client)) {
                    throw new Error("Can not parse client");
                }

                // move addresses inside to client
                const clientWithAddress = MambuService.putInside('client', 'addresses', result.body);

                if (Array.isArray(clientWithAddress.addresses)) {
                    clientWithAddress.address = clientWithAddress.addresses.find((address) => address.indexInList === 0);
                    if (clientWithAddress.address) {
                        clientWithAddress.address = mapFields(clientWithAddress.address, MambuService.clientsAddressFieldsMap);
                    }
                }
                return mapFields(MambuService.splitCustomField('client',clientWithAddress), MambuService.clientsFieldsMap) as MambuClient;
            });
    }

    /**
     * GET raw client - get user by key
     *
     * @param key client key
     */
    public getClientRaw(key: string): Promise<any> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/clients/' + key + '?fullDetails=true', 200)
        .then((result) => {
            if (!(result.body && result.body.client)) {
                throw new Error("Can not parse client");
            }
            return result.body;
        });
    }

    /**
     * GET clients - get user by key
     *
     * @param key client key
     */
    public getClient(key: string, raw: boolean = false): Promise<MambuClient> {
        return this.getClientRaw(key)
            .then((body) => {
                // move addresses inside to client
                const clientWithAddress = MambuService.putInside('client', 'addresses', body);

                if (clientWithAddress.client && clientWithAddress.client.addresses && Array.isArray(clientWithAddress.client.addresses)) {
                    clientWithAddress.client.address = clientWithAddress.client.addresses.find((address) => address.indexInList === 0);
                    if (clientWithAddress.client.address) {
                        clientWithAddress.client.address = mapFields(clientWithAddress.client.address, MambuService.clientsAddressFieldsMap);
                    }
                }

                return mapFields(MambuService.splitCustomField('client',clientWithAddress), MambuService.clientsFieldsMap) as MambuClient;
            });
    }

    /**
     * GET clients - search clients by filter
     * 
     * Filters:
     *  CREDIT_OFFICER_KEY	   KEY
     *  CLIENT_ROLE_KEY	       KEY
     *  BRANCH_KEY	           KEY
     *  CENTRE_KEY	           KEY
     *  GROUP_KEY	           KEY
     *  ENCODED_KEY	           KEY
     *  FULL_NAME	           STRING
     *  FIRST_NAME	           STRING
     *  MIDDLE_NAME	           STRING
     *  LAST_NAME	           STRING
     *  CREATION_DATE	       DATE_UTC
     *  LAST_MODIFIED_DATE	   DATE_UTC
     *  ID	                   STRING
     *  DEPOSITS_BALANCE	   MONEY
     *  LOANS_BALANCE	       MONEY
     *  PENDING_LOAN_AMOUNT	   MONEY
     *  APPROVED_LOAN_AMOUNT   MONEY
     *  TOTAL_BALANCE	       MONEY
     *  TOTAL_DUE	           MONEY
     *  HOME_PHONE_NUMBER	   STRING
     *  MOBILE_PHONE_NUMBER	   STRING
     *  EMAIL_ADDRESS	       STRING
     *  CLIENT_ADDRESS	       STRING
     *  BIRTHDATE	           DATE
     *  GENDER	               ENUM
     *  LOAN_CYCLE	           NUMBER
     *  GROUP_LOAN_CYCLE	   NUMBER
     *  CLIENT_STATE	       ENUM
     *  PORTAL_STATE	       ENUM
     *  PREFERRED_LANGUAGE	   ENUM
     *  GROUP_ID	           STRING
     * 
     * Types:
     *  EQUALS       BIG_DECIMAL,BOOLEAN,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY
     *  MORE_THAN    BIG_DECIMAL,NUMBER,MONEY
     *  LESS_THAN    BIG_DECIMAL,NUMBER,MONEY
     *  BETWEEN      BIG_DECIMAL,NUMBER,MONEY,DATE,DATE_UTC
     *  ON           DATE,DATE_UTC
     *  AFTER        DATE,DATE_UTC
     *  BEFORE       DATE,DATE_UTC
     *  STARTS_WITH  STRING
     *  IN           ENUM,KEY
     *  TODAY        DATE,DATE_UTC
     *  THIS_WEEK    DATE,DATE_UTC
     *  THIS_MONTH   DATE,DATE_UTC
     *  THIS_YEAR    DATE,DATE_UTC
     *  LAST_DAYS    DATE,DATE_UTC
     *  EMPTY        BIG_DECIMAL,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY,DATE,DATE_UTC
     *  NOT_EMPTY    BIG_DECIMAL,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY,DATE,DATE_UTC
     * 
     * This can`t return custom fields (I don`t know why?)
     *
     * @param filter filter for search
     */
    public searchClients(filter: {[key: string]: string | number | {value: string; type: string;}}): Promise<MambuClient[]> {
        const filterObject = Object.keys(filter).map((name) => {
            return {
                filterSelection: name,
                value: (typeof filter[name] === 'object')?(filter[name] as any).value:filter[name],
                filterElement: (typeof filter[name] === 'object')?(filter[name] as any).type:'EQUALS'
            }
        });

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/clients/search', 200, {
            filterConstraints: filterObject
        })
            .then((result) => {
                if (!result.body || !Array.isArray(result.body)) {
                    throw new Error("Can not parse client");
                }
                return result.body.map((item) => {
                    return mapFields(item, MambuService.clientsFieldsMap) as MambuClient;
                });
            });
    }

    /**
     * PATCH client - update user by key
     * 
     * This PATCH does not returning redirect to get. So it is ok, we will call it
     * later. But this PATCH can not change custom fields!!!
     * So we need to make PATCH request for custom fields and call PATCH for it.
     * For example: 
     *      If you want to change client emailAddress (dont forget, it is emailAdress not email as documentation says),
     *      and BVN_Clients.
     *      We will make request PATCH on /clients with emailAdress change, then we need to call
     *      PATCH /clients/{key}/custominformation with BVN change. And last request
     *      GET /clients/{key}?fullDetails=true (if it works).
     * 
     * This method creates PATCH request as you expect (and as we expected before reading documentation and try it in sandbox!)
     *
     * @param key client key
     * @param client client structure
     */
    public patchClient(key: string, client: MambuClient): Promise<MambuClient> {

        // first of all remove custom fields from flat structure of entity
        let clientEntity = null;

        // key of address, if null, nothing will be patched
        let oldAddress = {};

        return this.getClientRaw(key)
            .then((nclient) => {
                // try to get old address
                if (Array.isArray((nclient as any).addresses) && (nclient as any).addresses.length) {
                    oldAddress = (nclient as any).addresses[0];
                }

                // store clientEntity
                clientEntity = MambuService.extractCustomField('client',unmapFields(client, MambuService.clientsFieldsMap), MambuService.clientStandartFields, nclient.customInformation, this.config.groupedNames, false);

                // if no address field is included
                if (!client.address) {
                    return {}
                }

                let finalAddress = {
                    ...oldAddress,
                    ...unmapFields(client.address, MambuService.clientsAddressFieldsMap),
                };
                delete finalAddress['encodedKey'];
                delete finalAddress['parentKey'];
                delete finalAddress['indexInList'];

                // POST new address with merged old - patch it
                return baseRequest('Mambu', this.config, 'POST', this.config.url + '/clients/' + key , 201, {
                    addresses: [finalAddress]
                });
            })
            .then(() => {
                // remove address from patch
                if (clientEntity.client.address) {
                    delete clientEntity.client.address;
                }

                // if no standart fields is included
                if (!Object.keys(clientEntity.client).length) {
                    return {}
                }

                // patch client
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/clients/' + key, 200, {
                    client: clientEntity.client
                })
            })
            .then((result) => {
                // if no custom informations fields is included
                if (!clientEntity.customInformation.length) {
                    return {}
                }

                // patch custom information
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/clients/' + key + '/custominformation', 200, {
                    customInformation: clientEntity.customInformation
                })
            })
            .then((result) => {
                return this.getClient(key);
            });
    }

    /**
     * DELETE clients - delete client by key
     *
     * @param key client key
     */
    public deleteClientCustomField(key: string, customFieldId: string): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'DELETE', this.config.url + '/clients/' + key + '/custominformation/' + customFieldId, 200)
            .then((result) => result.body);
    }

    /**
     * DELETE clients - delete client by key
     *
     * @param key client key
     */
    public deleteClient(key: string): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'DELETE', this.config.url + '/clients/' + key, 200)
            .then((result) => result.body);
    }

    /**
     * POST clients/comment - create client comment
     * 
     * @param key client key
     * @param text comment text
     */
    public postClientComment(key: string, text: string): Promise<MambuComment> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/clients/' + key + '/comments', 201, {
            comment: {
                text
            }
        })
            .then((result) => result.body);
    }

    /**
     * POST loan/comment - create loan comment
     * 
     * @param key loan key
     * @param text comment text
     */
    public postLoanComment(key: string, text: string): Promise<MambuComment> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/loans/' + key + '/comments', 201, {
            comment: {
                text
            }
        })
            .then((result) => result.body);
    }

    /**
     * GET clients/comment - get client comment
     * 
     * @param key client key
     */
    public getClientComments(key: string): Promise<MambuComment[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/clients/' + key + '/comments', 200)
            .then((result) => result.body);
    }

    /**
     * GET tasks - tasks for user
     * 
     * @param key client key
     * @param offset offset for pagination
     * @param limit limit for pagination
     */
    public getTasks(clientKey: string, offset: number = 0, limit: number = 1000): Promise<MambuTask[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/tasks?clientid=' + clientKey.toString() + '&offset=' + offset.toString() + '&limit=' + limit.toString(), 200)
            .then((result) => {
                if (result.body) {
                    return result.body;
                }
                throw new Error("Can not parse tasks");
            });
    }

    /**
     * POST task - create task
     * 
     * @param keyToLink client key or other key
     * @param task task structure
     * @param linkType to what we link it
     */
    public postTask(keyToLink: string, task: MambuTask, linkType: string = 'CLIENT'): Promise<MambuTask> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/tasks', 201, {
            task: {
                assignedUserKey: this.config.robotUserKey,
                ...task,
                taskLinkKey: keyToLink,
                taskLinkType: linkType,
            }
        })
            .then((result) => {
                if (result.body) {
                    return result.body;
                }
                throw new Error("Can not parse task");
            });
    }

    /**
     * PATCH task - update task
     * 
     * This is fake patch, it will get and search right task and post hole structure to api!
     * It is because mambu api does not provide PATCH request for tasks (piece of shit!)
     * 
     * @param clientKey client key
     */
    public patchTask(clientKey: string, key: string, task: MambuTask): Promise<MambuTask> {
        return this.getTasks(clientKey, 0, 1000)
            .then((tasks) => {

                const foundTask = tasks.find((task) => task.encodedKey === key);
                if (!foundTask) {
                    throw new Error("Task not exists");
                }

                return baseRequest('Mambu', this.config, 'POST', this.config.url + '/tasks', 201, {
                    task: {
                        ...foundTask,
                        ...task,
                        assignedUserKey: this.config.robotUserKey
                    }
                })
                    .then((result) => {
                        if (result.body && result.body.task) {
                            return result.body.task;
                        }
                        throw new Error("Can not parse task");
                    });
            });
    }

    /**
     * DELETE task - delete task by key
     * 
     * @param key task key
     */
    public deleteTask(key: string): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'DELETE', this.config.url + '/tasks/' + key, 200)
            .then((result) => result.body);
    }

    /**
     * POST loan - create new loan account
     * 
     * @param clientKey client key
     * @param loan loan structure
     */
    public postLoan(clientKey: string, loan: MambuLoan): Promise<MambuLoan> {
        const mambuLoan = {
            ...MambuService.extractCustomField('loanAccount', unmapFields(loan, MambuService.loanFieldsMap), MambuService.loanStandartFields, [], this.config.groupedNames, true),
        };

        mambuLoan.loanAccount.accountHolderKey = clientKey;
        mambuLoan.loanAccount.accountHolderType = 'CLIENT';

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/loans/', 201, mambuLoan)
            .then((result) => result.body);
    }

    /**
     * GET raw loan - get loan by loan id
     * 
     * @param id loan id
     */
    public getLoanRaw(id: string): Promise<any> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/loans/' + id + '?fullDetails=true', 200)
            .then((result) => {
                return result.body;
            });
    }

    /**
     * GET loan - get loan by loan id
     * 
     * @param id loan id
     */
    public getLoan(id: string): Promise<MambuLoan> {
        return this.getLoanRaw(id)
            .then((body) => {
                return mapFields(MambuService.splitCustomField(null, body, 'customFieldValues'), MambuService.loanFieldsMap) as MambuLoan;
            });
    }

    /**
     * GET loans - get loans for client
     * 
     * @param clientKey client key
     */
    public getLoansForClient(clientKey: string): Promise<MambuLoan[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/clients/' + clientKey + '/loans/', 200)
            .then((result) => result.body);
    }

    /**
     * GET loan replayments
     * 
     * @param id loan id
     */
    public getLoanRepayments(id: string): Promise<MambuLoanRepayment[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/loans/' + id + '/repayments', 200)
            .then((result) => result.body);
    }

    /**
     * PATCH loan - edit loan
     * 
     * @param id loan id
     * @param loan loan structure for patch
     */
    public patchLoan(id: string, loan: MambuLoan): Promise<MambuLoan> {
        let mambuLoan = null;

        return this.getLoanRaw(id)
            .then((nlaon) => {

                // store loan to post
                mambuLoan = MambuService.extractCustomField('loanAccount', unmapFields(loan, MambuService.loanFieldsMap), MambuService.loanStandartFields, nlaon.customFieldValues, this.config.groupedNames, false);

                // if no standart fields is included
                if (!Object.keys(mambuLoan.loanAccount).length) {
                    return {}
                }

                // patch loan
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/loans/' + id, 200, {
                    loanAccount: mambuLoan.loanAccount
                })
            })
            .then((result) => {
                // if no custom informations fields is included
                if (!mambuLoan.customInformation.length) {
                    return {}
                }

                // patch custom information
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/loans/' + id + '/custominformation', 200, {
                    customInformation: mambuLoan.customInformation
                })
            })
            .then((result) => {
                return this.getLoan(id);
            });
    }

    /**
     * add loan transaction
     * 
     * @param id loan id
     * @param statusType type of added status
     */
    public addLoanTransactionStatus(id: string, statusType: 'REJECT' | 'WITHDRAW' | 'PENDING_APPROVAL' | 'APPROVAL'): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/loans/' + id + '/transactions/', 200, {
            type: statusType,
        })
            .then((result) => result.body);
    }

    /**
     * DELETE loan - delete loan
     * 
     * @param id loan id
     */
    public deleteLoan(id: string): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'DELETE', this.config.url + '/loans/' + id, 200)
            .then((result) => result.body);
    }

    /**
     * GET loans products
     * 
     * @param offset offset for pagination
     * @param limit limit for pagination
     */
    public getLoansproducts(offset: number = 0, limit: number = 1000): Promise<MambuLoanproduct[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/loanproducts' + '?offset=' + offset.toString() + '&limit=' + limit.toString(), 200)
            .then((result) => result.body);
    }

    /**
     * POST deposit - create new deposit account
     *
     * @param clientKey client key
     * @param deposit deposit structure
     */
    public postDeposit(clientKey: string, deposit: MambuDeposit): Promise<MambuDeposit> {
        const mambuDeposit = {
            ...MambuService.extractCustomField('savingsAccount', unmapFields(deposit, MambuService.depositFieldsMap), MambuService.depositStandartFields, [], this.config.groupedNames, true),
        };

        mambuDeposit.savingsAccount.accountHolderKey = clientKey;
        mambuDeposit.savingsAccount.accountHolderType = 'CLIENT';

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/savings/', 201, mambuDeposit)
            .then((result) => result.body);
    }

    /**
     * GET deposits - get deposits for client
     *
     * @param clientKey client key
     * @param fullDetails true for application full details
     */
    public getDepositsForClient(clientKey: string, fullDetails: boolean = false): Promise<MambuDeposit[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/clients/' + clientKey + '/savings?fullDetails=' + fullDetails, 200)
            .then((result) => result.body);
    }

    /**
     * GET raw deposit - get deposit by deposit id
     *
     * @param id loan id
     */
    public getDepositRaw(id: string): Promise<any> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/savings/' + id + '?fullDetails=true', 200)
            .then((result) => {
                return result.body;
            });
    }

    /**
     * GET deposit - get deposit by deposit id
     *
     * @param id deposit id
     */
    public getDeposit(id: string): Promise<MambuDeposit> {
        return this.getDepositRaw(id)
            .then((body) => {
                return mapFields(MambuService.splitCustomField(null, body, 'customFieldValues'), MambuService.depositFieldsMap) as MambuDeposit;
            });
    }

    /**
     * PATCH deposit - edit deposit
     *
     * @param id deposit id
     * @param deposit deposit structure for patch
     */
    public patchDeposit(id: string, deposit: MambuDeposit): Promise<MambuDeposit> {
        let mambuDeposit = null;

        return this.getDepositRaw(id)
            .then((ndeposit) => {

                console.log(ndeposit);

                // store deposit to post
                mambuDeposit = MambuService.extractCustomField('savingsAccount', unmapFields(deposit, MambuService.depositFieldsMap), MambuService.depositStandartFields, ndeposit.customFieldValues, this.config.groupedNames, false);

                // if no standart fields is included
                if (!Object.keys(mambuDeposit.savingsAccount).length) {
                    return {}
                }

                // patch deposit
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/savings/' + id, 200, {
                    savingsAccount: mambuDeposit.savingsAccount
                })
            })
            .then((result) => {
                // if no custom information fields is included
                if (!mambuDeposit.customInformation.length) {
                    return {}
                }

                // patch custom information
                return baseRequest('Mambu', this.config, 'PATCH', this.config.url + '/savings/' + id + '/custominformation', 200, {
                    customInformation: mambuDeposit.customInformation
                })
            })
            .then((result) => {
                return this.getDeposit(id);
            });
    }

    /**
     * add loan transaction
     *
     * @param id deposit id
     * @param statusType type of added status
     * @param transactionAmount amount made to transaction
     */
    public addDepositTransaction(id: string, statusType: 'DEPOSIT' | 'WITHDRAW', transactionAmount?: number): Promise<MambuResponse> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/savings/' + id + '/transactions/', [ 200, 201 ], {
            type: statusType,
            amount: transactionAmount,
            toSavingsAccount: id,
        })
            .then((result) => result.body);
    }

    /**
     * GET deposit products
     *
     * @param offset offset for pagination
     * @param limit limit for pagination
     */
    public getDepositProducts(offset: number = 0, limit: number = 1000): Promise<MambuDepositproduct[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/savingsproducts' + '?offset=' + offset.toString() + '&limit=' + limit.toString(), 200)
            .then((result) => result.body);
    }

    /**
     * GET documents
     * 
     * @param clientKey key of client
     * @param offset offset for pagination
     * @param limit limit for pagination
     */
    public getAttachmentsForClient(clientKey: string, offset: number = 0, limit: number = 1000): Promise<MambuAttachment[]> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/clients/' + clientKey + '/documents' + '?offset=' + offset.toString() + '&limit=' + limit.toString(), 200)
            .then((result) => result.body);
    }

    /**
     * Get base64 content of attachment by key
     *
     * @param attachmentKey key of attachmanet
     */
    public getAttachmentContent(attachmentKey: string): Promise<MambuAttachmentContent> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/documents/' + attachmentKey, 200)
            .then((result) => {
                return {content: result.body}
            });
    }

    /**
     * POST document
     * 
     * @param clientKey key of client for attach document to it
     * @param document document structure
     */
    public postAttachmentForClient(clientKey: string, document: MambuInputFile): Promise<MambuAttachment> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/documents', 201, {
            document: {
                documentHolderKey: clientKey,
                documentHolderType: "CLIENT",
                name: document.filename,
                type: document.filetype
            },
            documentContent: document.content
        })
            .then((result) => result.body);
    }

    /**
     * POST profile picture
     * 
     * @param clientKey key of client for attach document to it
     * @param document document structure
     */
    public postProfilePictureForClient(clientKey: string, document: MambuInputFile): Promise<MambuAttachment> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/clients/' + clientKey + '/documents/PROFILE_PICTURE ', 201, {
            document: {
                documentHolderKey: clientKey,
                documentHolderType: "CLIENT",
                name: "PROFILE_PICTURE",
                type: document.filetype
            },
            documentContent: document.content
        })
            .then((result) => result.body);
    }

    /**
     * POST document
     * 
     * @param clientKey key of client for attach document to it
     * @param document document structure
     */
    public postAttachmentForLoan(loanKey: string, document: MambuInputFile): Promise<MambuAttachment> {
        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/documents', 201, {
            document: {
                documentHolderKey: loanKey,
                documentHolderType: "LOAN_ACCOUNT",
                name: document.filename,
                type: document.filetype
            },
            documentContent: document.content
        })
            .then((result) => result.body);
    }

    /**
     * GET custom field info
     * 
     * @param customFieldId custom field id
     */
    public getCustomFieldInfo(customFieldId: string): Promise<MambuCustomFieldInfo> {
        if (this.config.useMockupFieldsInfo) {
            if (this.config.mockupFieldsInfo.hasOwnProperty(customFieldId)) {
                return Promise.resolve(this.config.mockupFieldsInfo[customFieldId]);
            }
        }
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/customfields/' + customFieldId, 200)
            .then((result) => result.body);
    }

    /**
     * GET group - get group by key
     *
     * @param key group key
     */
    public getGroup(key: string): Promise<MambuGroup> {
        return baseRequest('Mambu', this.config, 'GET', this.config.url + '/groups/' + key + '?fullDetails=true', 200)
            .then((result) => {
                if (!(result.body && result.body.theGroup)) {
                    throw new Error("Can not parse group");
                }

                // move addresses inside to group
                const groupWithAddress = MambuService.putInside('theGroup', 'addresses', result.body);

                if (groupWithAddress.theGroup && groupWithAddress.theGroup.addresses && Array.isArray(groupWithAddress.theGroup.addresses)) {
                    groupWithAddress.theGroup.address = groupWithAddress.theGroup.addresses.find((address) => address.indexInList === 0);
                    if (groupWithAddress.theGroup.address) {
                        groupWithAddress.theGroup.address = mapFields(groupWithAddress.theGroup.address, MambuService.groupAddressFieldsMap);
                    }
                }

                return mapFields(MambuService.splitCustomField('theGroup', groupWithAddress), MambuService.groupFieldsMap) as MambuGroup;
            });
    }

    /**
     * POST group 
     *
     * @param client new client structure
     */
    public postGroup(group: MambuGroup): Promise<MambuGroup> {
        const ngroup = {
            ...MambuService.extractCustomField('group', unmapFields(group, MambuService.groupFieldsMap), MambuService.groupStandartFields, [], this.config.groupedNames, true),
        };

        // delete address from client
        if (ngroup.group.address) {
            delete ngroup.group.address
        }

        // add address to root
        if (group.address) {
            ngroup.addresses = [
                unmapFields(group.address, MambuService.groupAddressFieldsMap)
            ];
        }

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/groups/', 201, ngroup)
            .then((result) => {
                if (!(result.body && result.body.group)) {
                    throw new Error("Can not parse group");
                }

                // move addresses inside to group
                const groupWithAddress = MambuService.putInside('group', 'addresses', result.body);

                if (groupWithAddress.group && groupWithAddress.group.addresses && Array.isArray(groupWithAddress.group.addresses)) {
                    groupWithAddress.group.address = groupWithAddress.group.addresses.find((address) => address.indexInList === 0);
                    if (groupWithAddress.group.address) {
                        groupWithAddress.group.address = mapFields(groupWithAddress.group.address, MambuService.groupAddressFieldsMap);
                    }
                }

                return mapFields(MambuService.splitCustomField('group', groupWithAddress), MambuService.groupFieldsMap) as MambuGroup;
            });
    }

    public getCustomFieldMapping(customFieldId: string): Promise<{ [key: string]: string }> {
        return this.getCustomFieldInfo(MambuService.getMambuFieldName(customFieldId))
            .then((info) => {
                return enumMappingFromMambuCustomFieldInfo(info);
            })
    }

    /**
     * GET group - search groups by filter
     * 
     * Filters:
     *  CLIENT_ROLE_KEY     KEY
     *  BRANCH_KEY          KEY
     *  CENTRE_KEY          KEY
     *  CREDIT_OFFICER_KEY  KEY
     *  ENCODED_KEY         KEY
     *  GROUP_NAME          STRING
     *  CREATION_DATE       DATE_UTC
     *  LAST_MODIFIED_DATE  DATE_UTC
     *  ID                  STRING
     *  PREFERRED_LANGUAGE  ENUM
     *  DEPOSITS_BALANCE    MONEY
     *  LOANS_BALANCE       MONEY
     *  TOTAL_BALANCE       MONEY
     *  NUMBER_OF_MEMBERS   NUMBER
     *  LOAN_CYCLE          NUMBER
     * 
     * Types:
     *  EQUALS       BIG_DECIMAL,BOOLEAN,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY
     *  MORE_THAN    BIG_DECIMAL,NUMBER,MONEY
     *  LESS_THAN    BIG_DECIMAL,NUMBER,MONEY
     *  BETWEEN      BIG_DECIMAL,NUMBER,MONEY,DATE,DATE_UTC
     *  ON           DATE,DATE_UTC
     *  AFTER        DATE,DATE_UTC
     *  BEFORE       DATE,DATE_UTC
     *  STARTS_WITH  STRING
     *  IN           ENUM,KEY
     *  TODAY        DATE,DATE_UTC
     *  THIS_WEEK    DATE,DATE_UTC
     *  THIS_MONTH   DATE,DATE_UTC
     *  THIS_YEAR    DATE,DATE_UTC
     *  LAST_DAYS    DATE,DATE_UTC
     *  EMPTY        BIG_DECIMAL,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY,DATE,DATE_UTC
     *  NOT_EMPTY    BIG_DECIMAL,LONG,MONEY,NUMBER,PERCENT,STRING,ENUM,KEY,DATE,DATE_UTC
     *
     * This can`t return custom fields (I don`t know why?)
     *
     * @param filter filter for search
     */
    public searchGroups(filter: {[key: string]: string | number | {value: string; type: string;}}): Promise<MambuGroup[]> {
        const filterObject = Object.keys(filter).map((name) => {
            return {
                filterSelection: name,
                value: (typeof filter[name] === 'object')?(filter[name] as any).value:filter[name],
                filterElement: (typeof filter[name] === 'object')?(filter[name] as any).type:'EQUALS'
            }
        });

        return baseRequest('Mambu', this.config, 'POST', this.config.url + '/groups/search', 200, {
            filterConstraints: filterObject
        })
            .then((result) => {
                if (!result.body || !Array.isArray(result.body)) {
                    throw new Error("Can not parse group");
                }
                return result.body.map((item) => {
                    return mapFields(item, MambuService.groupFieldsMap) as MambuGroup;
                });
            });
    }


    /******************************************************
     * Protected helpers
     ******************************************************/

    /**
     * Put object [outsideObjectName] in objectWithEntity into one object [entityName]
     */
    protected static putInside(entityName: string, outsideObjectName: string, objectWithEntity: any) {
        const ret = {
            ...objectWithEntity,
            [entityName]: {
                ...objectWithEntity[entityName],
                [outsideObjectName]: objectWithEntity[outsideObjectName]
            }
        };
        delete ret[outsideObjectName];
        return ret;
    }

    /**
     * Put object [insideObjectName] in object to outside
     */
    protected static putOutside(entityName: string, insideObjectName: string, objectWithEntity: any) {
        const entityWithoutObject = {...objectWithEntity[entityName]};
        delete entityWithoutObject[insideObjectName];

        return {
            [entityName]: entityWithoutObject,
            [insideObjectName]: objectWithEntity[entityName][insideObjectName]
        };
    }

    /**
     * Make flat structure from received object with custom fields.
     * It can be used for any entity with custom fields,
     * this will split it to flat structure.
     * 
     * @param entityName name of entity in object
     * @param objectWithEntity object that must include entity object in property [entityName]
     */
    protected static splitCustomField(entityName: string, objectWithEntity: any, customInfoName: string = 'customInformation') {
        let newEntity = Object.assign({}, objectWithEntity); // copy
        if (entityName) {
            newEntity = {...objectWithEntity[entityName]};
        }

        if (!objectWithEntity[customInfoName]) {
            return newEntity;
        }

        let lowestIndex: {[key: string]: number} = {};

        // split custom informations into client structure
        for(let i of objectWithEntity[customInfoName]) {
            // store customFieldSetGroupIndex if not stored yes
            if (!lowestIndex.hasOwnProperty(i.customFieldID)) {
                lowestIndex[i.customFieldID] = i.customFieldSetGroupIndex;
            }
            // if customFieldSetGroupIndex is bigger than stored, continue (ignore it)
            if (i.customFieldSetGroupIndex > lowestIndex[i.customFieldID]) {
                continue;
            }
            lowestIndex[i.customFieldID] = i.customFieldSetGroupIndex;
            let val = i.value;
            // remap boolean for checkbox type in mambu
            if (val === 'TRUE') {
                val = true;
            }
            if (val === 'FALSE') {
                val = false;
            }
            newEntity[i.customFieldID] = val;
        }

        delete newEntity[customInfoName];

        return newEntity;
    }

    /**
     * Prepare custom fileds for send - unflat custom fields and add it to separated array customInformation
     * 
     * @param entityName name of entity in object
     * @param entity object of entity
     * @param standartFields array of string names of standart fields that is not affected by this method
     */
    protected static extractCustomField(entityName: string, entity: any, standartFields: string[], sourceCustomFields: any[], groupIndexMap: string[][], addGroupIndexToAll: boolean): any {
        const customFields = Object.keys(entity).filter((item) => standartFields.indexOf(item) === -1);
        const newEntity = {
            customInformation: [],
            [entityName]: {...entity}
        };

        // keys to which add some customFieldSetGroupIndex
        let keysToAddGroupIndex: { [key: string]: number } = {};

        let lowestIndex: { [groupId: number]: number } = {};

        // if have old custom fields
        if (sourceCustomFields) {
            // check each one
            sourceCustomFields.forEach((cf) => {
                let id = cf.customFieldID;
                let index = cf.customFieldSetGroupIndex;

                // and look at every group
                groupIndexMap.forEach((group, groupId) => {
                    // if this custom field key is found in group
                    if (group.indexOf(id) > -1) {

                        // store index if not stored or lower it if bigger than current
                        if (!lowestIndex.hasOwnProperty(groupId)) {
                            lowestIndex[groupId] = index;
                        } else if (lowestIndex[groupId] > index) {
                            lowestIndex[groupId] = index;
                        }
                        
                        // add all keys from group to keysToAddGroupIndex
                        group.forEach((key) => {
                            keysToAddGroupIndex[key] = lowestIndex[groupId];
                        });
                    }
                });
            });
        }

        if (addGroupIndexToAll) {
            groupIndexMap.forEach((group) => {
                group.forEach((key) => {
                    keysToAddGroupIndex[key] = 0;
                });
            });
        }

        // extract custom fields into customInformation array
        for(let key of customFields) {
            delete newEntity[entityName][key];
            // ignore undefined
            if (entity[key] !== undefined) {
                let val = entity[key];
                // remap boolean for checkbox type in mambu
                if (typeof val === 'boolean') {
                    val = val ? 'TRUE' : 'FALSE';
                }
                let ci = {
                    customFieldID: key,
                    value: val
                }
                // add if exist in keysToAddGroupIndex array
                if (keysToAddGroupIndex.hasOwnProperty(key)) {
                    ci['customFieldSetGroupIndex'] = keysToAddGroupIndex[key];
                }
                newEntity.customInformation.push(ci);
            }
        }

        return newEntity;
    }

    public static getMambuFieldName(ourFieldName: string): string {
        let clientName = Object.keys(MambuService.clientsFieldsMap).find((key) => (MambuService.clientsFieldsMap[key] === ourFieldName));
        if (clientName) {
            return clientName;
        }
        let loanName = Object.keys(MambuService.loanFieldsMap).find((key) => (MambuService.loanFieldsMap[key] === ourFieldName));
        if (loanName) {
            return loanName;
        }
        return ourFieldName;
    }
}
