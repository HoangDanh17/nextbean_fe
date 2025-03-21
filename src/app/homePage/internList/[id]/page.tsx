import FilterIntern from "@/components/manageintern/FilterIntern";

const listIntern = (props: any) => {
  const { params } = props;

  // Giải mã chuỗi URL
  const decodedParams = decodeURIComponent(params.id);

  // Tách các tham số từ chuỗi query
  const queryParams = new URLSearchParams(decodedParams);
  const name = queryParams.get("name") || "";
  const id = parseInt(queryParams.get("id") || "0", 10);

  return (
    <div>
      <FilterIntern name={name} id={id}></FilterIntern>
    </div>
  );
};

export default listIntern;
