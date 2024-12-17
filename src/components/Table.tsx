import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import Overlay from "./Overlay";

interface Product {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

interface SelectedColumn {
  pageNo: number;
  selectedColumn: number;
}

function Table(): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(100);
  const [first, setFirst] = useState<number>(0);
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string | null>(null);
  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}`
        );
        const result = await response.json();

        if (result.error) {
          setErrors(result.error);
        } else {
          setProducts(result.data);
          setTotalRecords(result.pagination.total);

          if (selectedColumn.length) {
            selectedColumn.forEach((i) => {
              if (i.pageNo === page) {
                for (let j = 0; j < i.selectedColumn; j++) {
                  setSelectedProducts((prev) => [...prev, result.data[j]]);
                }
              }
            });
          }
        }
      } catch (err) {
        setErrors("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedColumn]);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page + 1);
    setFirst(e.first);
  };

  const handleSelectionChange = (e: { value: Product[] }) => {
    setSelectedProducts(e.value);
  };

  return (
    <PrimeReactProvider>
      <div style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(233, 233, 233, 0.8)",
              zIndex: 1000,
            }}
          >
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "10rem", color: "#007bff" }}
            ></i>
          </div>
        )}

        {errors && (
          <div
            style={{
              color: "red",
              position: "absolute",
              width: "100vw",
              height: "100vh",
              marginBottom: "1rem",
              fontSize: "4rem",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(3, 0, 0, 0.8)",
              zIndex: 1000,
            }}
          >
            {errors}
          </div>
        )}

        <DataTable
          value={products}
          paginator={false}
          onSelectionChange={handleSelectionChange}
          dataKey="id"
          selection={selectedProducts}
           selectionMode="multiple"
          tableStyle={{
            width: "full",
            alignContent: "center",
            placeSelf: "center",
          }}
        >
          <Column selectionMode="multiple" style={{ width: "0%" }}></Column>
          <Column
            style={{ width: "0%" }}
            header={
              <div
                className="card flex justify-content-center"
                style={{ position: "relative" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#ffffff"
                  fill="none"
                  onClick={(e) => op.current?.toggle(e)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <OverlayPanel
                  ref={op}
                  style={{ zIndex: 1000, marginTop: "50px" }}
                >
                  <Overlay setSelectedColumn={setSelectedColumn} />
                </OverlayPanel>
              </div>
            }
          ></Column>
          <Column
            field="title"
            header="Title"
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="place_of_origin"
            header="Place of Origin"
            style={{ width: "7%", alignItems: "center" }}
          ></Column>
          <Column
            field="artist_display"
            header="Artist Display"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="inscriptions"
            header="Inscriptions"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="date_start"
            header="Date Start"
            style={{ width: "5%" }}
          ></Column>
          <Column
            field="date_end"
            header="Date End"
            style={{ width: "5%" }}
          ></Column>
        </DataTable>
        <Paginator
          first={first}
          rows={12}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      </div>
    </PrimeReactProvider>
  );
}

export default Table;
