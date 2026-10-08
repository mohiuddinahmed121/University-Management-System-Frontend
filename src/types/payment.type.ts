export interface IPaymentStudentMini {
   id: string;
   studentId: string;
   name: string;
   email: string;
}

export interface IPaymentSemesterMini {
   id: string;
   name: string;
   year?: number;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface IPayment {
   id: string;
   studentId: string;
   semesterId: string;
   amount: number;
   status: PaymentStatus;
   merchantInvoiceNumber: string;
   bkashPaymentId?: string | null;
   bkashTrxId?: string | null;
   payerReference?: string | null;
   paidAt?: string | null;
   createdAt: string;
   updatedAt: string;
   student: IPaymentStudentMini;
   semester: IPaymentSemesterMini;
}

export interface ICreatePaymentPayload {
   semesterId: string;
}

export interface ICreatePaymentResponse {
   bkashURL: string;
   paymentID: string;
}

export interface IGetPaymentsQuery {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: "asc" | "desc";
   studentEmail?: string;
   studentId?: string;
   status?: PaymentStatus;
}

export interface IPaymentsMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
}

export interface IGetPaymentsResponse {
   data: IPayment[];
   meta: IPaymentsMeta;
}
