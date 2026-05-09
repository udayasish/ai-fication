"use client";

export default function SpendForm() {
  return (
    <form>
      {/* ── Meta fields ── */}
      <div>
        <label htmlFor="teamSize">Team size</label>
        <input id="teamSize" type="number" placeholder="e.g. 10" />
      </div>

      <div>
        <label htmlFor="useCase">Primary use case</label>
        <select id="useCase">
          <option value="">Select use case</option>
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="research">Research</option>
          <option value="customer_support">Customer support</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* ── Tool rows ── */}
      <div>
        {/* ToolInput components will go here */}
      </div>

      {/* ── Submit ── */}
      <button type="submit">Run My Audit</button>
    </form>
  );
}
