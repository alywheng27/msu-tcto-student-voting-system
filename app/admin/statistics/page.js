"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { getAllVotes } from "@/lib/results";

export default function StatisticsPage() {
  const [college, setCollege] = useState("all");
  const [position, setPosition] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [votes, setVotes] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllVotes({}),
      fetch("/api/admin/candidates").then((res) => res.json()),
      fetch("/api/admin/positions").then((res) => res.json()),
      fetch("/api/login/college").then((res) => res.json()),
      fetch("/api/admin/voters").then((res) => res.json()),
    ]).then(
      ([
        votesData,
        candidatesData,
        positionsData,
        collegesData,
        votersData,
      ]) => {
        setVotes(votesData);
        setCandidates(candidatesData);
        setPositions(positionsData);
        setColleges(collegesData);
        setVoters(votersData);
        setLoading(false);
      }
    );
  }, []);

  const filteredVotes = votes.filter((vote) => {
    let match = true;
    const candidate = candidates.find(
      (c) => c.CandidateID === vote.CandidateID
    );
    if (
      college !== "all" &&
      candidate &&
      String(candidate.CollegeOfficeID) !== String(college)
    )
      match = false;
    if (
      position !== "all" &&
      candidate &&
      String(candidate.PositionID) !== String(position)
    )
      match = false;
    if (
      dateFrom !== "" &&
      dayjs(vote.VoteTimeSubmitted).isBefore(dayjs(dateFrom))
    )
      match = false;
    if (
      dateTo !== "" &&
      dayjs(vote.VoteTimeSubmitted).isAfter(dayjs(dateTo).endOf("day"))
    )
      match = false;
    return match;
  });

  const candidateReport = Object.values(
    filteredVotes.reduce((acc, vote) => {
      const candidate =
        candidates.find((c) => c.CandidateID === vote.CandidateID) || {};
      const positionObj =
        positions.find((p) => p.PositionID === candidate.PositionID) || {};
      const collegeObj =
        colleges.find((c) => c.CollegeOfficeID === candidate.CollegeOfficeID) ||
        {};
      const party = candidate.Party || candidate.PartyID || "";
      const key = vote.CandidateID;
      if (!acc[key]) {
        acc[key] = {
          "First Name": candidate.FirstName || vote.FirstName || "",
          Surname: candidate.Surname || vote.Surname || "",
          Position: positionObj.Position || vote.Position || "",
          Party: party,
          College: collegeObj.CollegeOffice || vote.CollegeOffice || "",
          "Total Votes": 0,
        };
      }
      acc[key]["Total Votes"]++;
      return acc;
    }, {})
  );

  const filteredCandidateReport = candidateReport.filter((row) => {
    const q = search.toLowerCase();
    return (
      row["First Name"].toLowerCase().includes(q) ||
      row["Surname"].toLowerCase().includes(q) ||
      row["Position"].toLowerCase().includes(q) ||
      row["Party"].toLowerCase().includes(q) ||
      row["College"].toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filteredCandidateReport.length / pageSize) || 1;
  const paginatedCandidateReport = filteredCandidateReport.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const candidateStats = filteredVotes.reduce((acc, vote) => {
    const candidate =
      candidates.find((c) => c.CandidateID === vote.CandidateID) || {};
    const key =
      vote.CandidateID +
      "-" +
      (candidate.FirstName || vote.FirstName || "") +
      " " +
      (candidate.Surname || vote.Surname || "");
    if (!acc[key])
      acc[key] = { name: candidate.Surname || vote.Surname || "", votes: 0 };
    acc[key].votes++;
    return acc;
  }, {});
  const candidateChartData = Object.values(candidateStats);

  const votedCount = voters.filter(
    (v) => v.HasVotedSSC === true || v.HasVotedCollege === true
  ).length;
  const notVotedCount = voters.filter(
    (v) => v.HasVotedSSC === false && v.HasVotedCollege === false
  ).length;
  const turnoutData = [
    { name: "Voted", value: votedCount, fill: "#4F46E5" },
    { name: "Not Voted", value: notVotedCount, fill: "#EF4444" },
  ];

  const voteListReport = filteredVotes.map((vote) => {
    const candidate =
      candidates.find((c) => c.CandidateID === vote.CandidateID) || {};
    const voter = voters.find((v) => v.UserID === vote.VoterID) || {};
    const voterName =
      voter.FirstName && voter.Surname
        ? `${voter.FirstName} ${voter.Surname}`
        : voter.FirstName || voter.Surname || "";
    const candidateName =
      candidate.FirstName && candidate.Surname
        ? `${candidate.FirstName} ${candidate.Surname}`
        : candidate.FirstName || candidate.Surname || "";
    return {
      "Vote ID": vote.VoteID,
      "Voter's Name": voterName,
      "Candidate's Name": candidateName,
      "Vote Time Submitted": dayjs(vote.VoteTimeSubmitted).format("YYYY-MM-DD hh:mm:ss A"),
    };
  });

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(candidateReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SSC & Colleges Election Report");
    const buf = XLSX.write(wb, { bookType: "csv", type: "array" });
    saveAs(
      new Blob([buf], { type: "text/csv" }),
      "MSU-TCTO SSC and Colleges Election Report.csv"
    );
  };
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(candidateReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SSC & Colleges Election Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "MSU-TCTO SSC and Colleges Election Report.xlsx"
    );
  };
  const exportPDF = () => {
    const doc = new jsPDF();

    // Set image width and height
    const imgWidth = 20;
    const imgHeight = 20;

    // Get page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Left image position
    const leftImgX = 14;
    // Right image position
    const rightImgX = pageWidth - imgWidth - 14;

    // Add left image
    doc.addImage("/MSU-TCTO.png", "PNG", leftImgX, 5, imgWidth, imgHeight);
    // Add right image
    doc.addImage("/colleges/SSC.png", "PNG", rightImgX, 5, imgWidth, imgHeight);

    // Center the title text between the images
    const title = "MSU-TCTO SSC and Colleges Election Report";
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 16);

    autoTable(doc, {
      head: [
        [
          "First Name",
          "Surname",
          "Position",
          "Party",
          "College",
          "Total Votes",
        ],
      ],
      body: candidateReport.map((row) => [
        row["First Name"],
        row["Surname"],
        row["Position"],
        row["Party"],
        row["College"],
        row["Total Votes"],
      ]),
      startY: 28, // Adjusted to avoid overlapping with the image
    });
    doc.save("MSU-TCTO SSC and Colleges Election Report.pdf");
  };

  const exportVoteListCSV = () => {
    const ws = XLSX.utils.json_to_sheet(voteListReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MSU-TCTO Students Votes Report");
    const buf = XLSX.write(wb, { bookType: "csv", type: "array" });
    saveAs(
      new Blob([buf], { type: "text/csv" }),
      "MSU-TCTO Students Votes Report.csv"
    );
  };
  const exportVoteListExcel = () => {
    const ws = XLSX.utils.json_to_sheet(voteListReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MSU-TCTO Students Votes Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "MSU-TCTO Students Votes Report.xlsx"
    );
  };
  const exportVoteListPDF = () => {
    const doc = new jsPDF();

    // Set image width and height
    const imgWidth = 20;
    const imgHeight = 20;

    // Get page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Left image position
    const leftImgX = 14;
    // Right image position
    const rightImgX = pageWidth - imgWidth - 14;

    // Add left image
    doc.addImage("/MSU-TCTO.png", "PNG", leftImgX, 5, imgWidth, imgHeight);
    // Add right image
    doc.addImage("/colleges/SSC.png", "PNG", rightImgX, 5, imgWidth, imgHeight);

    // Center the title text between the images
    const title = "MSU-TCTO Students Votes Report";
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 16);

    autoTable(doc, {
      head: [
        ["Vote ID", "Voter's Name", "Candidate's Name", "Vote Time Submitted"],
      ],
      body: voteListReport.map((row) => [
        row["Vote ID"],
        row["Voter's Name"],
        row["Candidate's Name"],
        row["Vote Time Submitted"],
      ]),
      startY: 28, // Adjusted to avoid overlapping with the image
    });
    doc.save("MSU-TCTO Students Votes Report.pdf");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Election Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              value={college}
              onValueChange={(val) => setCollege(val || "")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by College" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {colleges.map((col) => (
                  <SelectItem
                    key={col.CollegeOfficeID}
                    value={String(col.CollegeOfficeID)}
                  >
                    {col.CollegeOffice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={position}
              onValueChange={(val) => setPosition(val || "all")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((pos) => (
                  <SelectItem
                    key={pos.PositionID}
                    value={String(pos.PositionID)}
                  >
                    {pos.Position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <label htmlFor="dateFrom">From:</label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <label htmlFor="dateTo">To:</label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
          </div>

          <Card className="mb-8 p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-row gap-2 items-end">
                <span className="font-semibold mr-2 self-center">
                  Candidate Report:
                </span>
                <Button
                  onClick={exportCSV}
                  disabled={candidateReport.length === 0}
                >
                  Export CSV
                </Button>
                <Button
                  onClick={exportExcel}
                  disabled={candidateReport.length === 0}
                >
                  Export Excel
                </Button>
                <Button
                  onClick={exportPDF}
                  disabled={candidateReport.length === 0}
                >
                  Export PDF
                </Button>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-end">
              <span className="font-semibold mr-2 self-center">
                Vote List Report:
              </span>
              <Button
                onClick={exportVoteListCSV}
                disabled={voteListReport.length === 0}
              >
                Export CSV
              </Button>
              <Button
                onClick={exportVoteListExcel}
                disabled={voteListReport.length === 0}
              >
                Export Excel
              </Button>
              <Button
                onClick={exportVoteListPDF}
                disabled={voteListReport.length === 0}
              >
                Export PDF
              </Button>
            </div>
          </Card>

          <Card className="mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Votes per Candidate</h3>
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={candidateChartData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        tickMargin={5}
                        axisLine={false}
                      />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="votes" fill="#4F46E5" radius={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Voter Turnout</h3>
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={turnoutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent nameKey="name" hideLabel />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </Card>

          <Card className="mb-8 p-6">
            <div className="overflow-x-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded px-2 py-1 w-full md:w-64"
                />
                <div className="flex items-center gap-2">
                  <label>Rows per page:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Total Votes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCandidateReport.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row["First Name"]}</TableCell>
                      <TableCell>{row["Surname"]}</TableCell>
                      <TableCell>{row["Position"]}</TableCell>
                      <TableCell>{row["Party"]}</TableCell>
                      <TableCell>{row["College"]}</TableCell>
                      <TableCell>{row["Total Votes"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
                <div>
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setPage(1)} disabled={page === 1}>
                    First
                  </Button>
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
              {loading && <div className="text-center py-4">Loading...</div>}
              {!loading && filteredCandidateReport.length === 0 && (
                <div className="text-center py-4">No results found.</div>
              )}
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
