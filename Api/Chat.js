module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const prompt = String((req.body && req.body.prompt) || "").slice(0, 4000);
  if (!prompt) return res.status(400).json({ error: "empty" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const d = await r.json();
    const text = (d.content || []).map(c => c.text || "").join("");
    if (!text) return res.status(502).json({ error: "no answer" });
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: "failed" });
  }
};
