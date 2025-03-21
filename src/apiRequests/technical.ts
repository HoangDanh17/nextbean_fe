import http from "@/lib/http";
import { TechnicalListResType } from "@/schemaValidations/technical.schema";

const technicalApiRequest = {
  getListTechnical: () => http.get<TechnicalListResType>(`/api/v1/technicals?psize=99`),
};

export default technicalApiRequest;
