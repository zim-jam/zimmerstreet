import { Table, Spinner, Link } from "@heroui/react";
import { Globe } from "@gravity-ui/icons";
import { useForecast } from "../hooks/useForecast";

interface NewsProps {
  ticker: string;
}

const NewsTable = ({ ticker }: NewsProps) => {
  const { data, isLoading, isError } = useForecast(ticker);

  const news = data?.recent_news || [];

  if (isError) {
    return <div className="text-danger">Failed to load news for {ticker}.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-foreground px-2 text-base font-semibold">
          Recent News {ticker}
        </span>
      </div>

      <Table color="secondary" aria-label="Recent news">
        <Table.ScrollContainer>
          <Table.Content selectionMode="none" className="min-w-175">
            <Table.Header>
              <Table.Column>Publisher</Table.Column>
              <Table.Column>Title</Table.Column>
              <Table.Column>Action</Table.Column>
              <Table.Column>Date</Table.Column>
            </Table.Header>

            <Table.Body
              items={news}
              renderEmptyState={() =>
                isLoading ? (
                  <div className="flex justify-center p-4">
                    <Spinner aria-label="Loading news..." />
                  </div>
                ) : (
                  <div className="text-center pt-8 text-muted">
                    No news available
                  </div>
                )
              }
            >
              {(item) => (
                <Table.Row id={item.link}>
                  <Table.Cell className="whitespace-nowrap">
                    <div className="flex items-center gap-2 font-medium">
                      <Globe className="text-muted w-4 h-4 shrink-0" />
                      <span>{item.publisher}</span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="w-full max-w-0">
                    <span
                      className="text-sm block truncate w-full"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  </Table.Cell>

                  <Table.Cell className="text-muted text-xs whitespace-nowrap">
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-medium"
                    >
                      Read
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="whitespace-nowrap">
                    <span className="text-right">
                      {new Date(item.publish_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
};

export default NewsTable;
