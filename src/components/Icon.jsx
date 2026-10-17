const desenhos = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  trophy: <><path d="M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v7m-4 1h8"/></>,
  coin: <><circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v12"/></>,
  flame: <path d="M13 3c1 5-4 5-3 9-2 0-3-2-3-3-5 6-2 12 5 12s10-8 1-18Z"/>,
  trend: <><path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/></>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  logout: <><path d="M9 4H4v16h5m0-8h12m-4-4 4 4-4 4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  star: <path d="m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1Z"/>,
  edit: <><path d="m15 4 5 5-11 11H4v-5ZM13 6l5 5"/></>,
}

export default function Icon({ name, size = 20 }) {
  return <svg className="rise-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{desenhos[name] || desenhos.target}</svg>
}
