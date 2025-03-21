import http from "@/lib/http";
import {
  dashboardListResType,
  dashboardListTotalResType,
} from "@/schemaValidations/dashboard.schema";

const dashboardApiRequest = {
  getOjt: () =>
    http.get<dashboardListResType>(`/api/v1/dashboards/inprogress-ojt`),
  getTotal: () =>
    http.get<dashboardListTotalResType>(`/api/v1/dashboards/total-number`),
};

export default dashboardApiRequest;
