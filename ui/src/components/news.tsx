import { useState, useMemo } from "react";
import { Table, Pagination, Spinner, Link } from "@heroui/react";

import { Globe } from "@gravity-ui/icons";

import { useForecast } from "../hooks/useForecast";

interface NewsProps {
  ticker: string;
}

const News = ({ ticker }: NewsProps) => {
  const { data, isLoading, isError } = useForecast(ticker);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const news = data?.recent_news || [];
  const pages = Math.ceil(news.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return news.slice(start, end);
  }, [page, news]);

  if (isError) {
    return <div className="text-danger">Failed to load news for {ticker}.</div>;
  }

  const startItem = news.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, news.length);

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
              items={items}
              renderEmptyState={() =>
                isLoading ? (
                  <div className="flex justify-center p-4">
                    <Spinner aria-label="Loading news..." />
                  </div>
                ) : (
                  "No recent news found."
                )
              }
            >
              {(item) => (
                <Table.Row id={item.link}>
                  <Table.Cell>
                    <div className="flex items-center gap-2 font-medium">
                      <Globe className="text-muted w-4 h-4 shrink-0" />
                      <span>{item.publisher}</span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <span className="text-sm block ">{item.title}</span>
                  </Table.Cell>

                  <Table.Cell className="text-muted text-xs">
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-medium"
                    >
                      Read
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
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

        <Table.Footer>
          {pages > 0 && (
            <Pagination size="sm" className="px-4 py-2.5">
              <Pagination.Summary>
                {startItem} to {endItem} of {news.length} news
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <Pagination.PreviousIcon />
                    <span>Previous</span>
                  </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === pages}
                    onPress={() => setPage((p) => Math.min(pages, p + 1))}
                  >
                    <span>Next</span>
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          )}
        </Table.Footer>
      </Table>
    </div>
  );
};

export default News;
