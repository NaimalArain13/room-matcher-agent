export const runPipeline = async (fileUrl: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/run-pipeline`, { // Updated environment variable name
        method: "POST",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: fileUrl }),
    });
    return res.json();
}