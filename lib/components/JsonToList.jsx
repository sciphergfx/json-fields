import React, { useMemo, useState } from 'react';

/**
 * List
 * UI-agnostic collapsible list from JSON.
 *
 * Props:
 * - data: Array<{ id?: string|number, label: string, children?: Array, icon?: ReactNode }>
 * - uiLibrary: 'chakra' | 'tailwind' | 'shadcn'
 * - startIcon?: ReactNode                 // appears near the header title (optional)
 * - headerTitle?: React.ReactNode         // title content above the list (default: 'Projects')
 * - headerDescription?: React.ReactNode   // optional description text under the title
 * - mode?: 'light' | 'dark'               // per-component color mode (default: 'dark')
 * - parentIcon?: ReactNode                // legacy parent icon (use open/closed below for disclosure)
 * - parentOpenIcon?: ReactNode            // icon for an open parent (defaults to ▼)
 * - parentClosedIcon?: ReactNode          // icon for a closed parent (defaults to ▶)
 * - childIcon?: ReactNode                 // icon for child leaf nodes
 * - hoverIcon?: ReactNode                 // icon shown on hover at row end (defaults to '…')
 * - onItemClick?: (item) => void          // click on any row
 * - onToggle?: (item, isOpen) => void     // when a parent is toggled
 * - sections?: Array<{ id?: string, title: string, description?: string, collapsible?: boolean, defaultOpen?: boolean, filter?: (item) => boolean }>
 * - groupBy?: (item) => string            // alternative to sections: derive section title from function
 * - sectionOrder?: string[]               // optional order for groupBy section titles
 * - customStyles?: { container?, header?, list?, row?, label?, icon?, hoverIcon?, child?, parent?, sectionHeader? }
 */
export default function List({
  data = [],
  // headless props
  classNames = {},
  styles: styleProps = {},
  renderers = {},
  // deprecated: ui library selection (kept for backward compat, ignored in headless)
  uiLibrary = 'chakra',
  startIcon = null,
  headerTitle = 'Projects',
  headerDescription = null,
  mode = 'dark',
  parentIcon = null,
  parentOpenIcon = null,
  parentClosedIcon = null,
  childIcon = null,
  hoverIcon = null,
  onItemClick = () => {},
  onToggle = () => {},
  sections = null,
  groupBy = null,
  sectionOrder = null,
  customStyles = {},
}) {
  // Primitive UI (headless). Consumers can override via `renderers`.
  const UI = {
    Container: renderers.Container || 'div',
    Box: renderers.Box || 'div',
    Heading: renderers.Heading || 'h2',
    Text: renderers.Text || 'span',
  };

  const palette = useMemo(() => {
    if (mode === 'light') {
      return {
        bg: '#ffffff',
        headerText: '#4B5563',
        text: '#111827',
        rowHoverBg: '#F3F4F6',
        icon: '#374151',
        hoverIcon: '#6B7280',
        border: '#E5E7EB',
      };
    }
    // dark (default)
    return {
      bg: '#111827',
      headerText: '#9CA3AF',
      text: '#E5E7EB',
      rowHoverBg: '#1F2937',
      icon: '#E5E7EB',
      hoverIcon: '#9CA3AF',
      border: '#374151',
    };
  }, [mode]);

  const defaults = {
    container: { background: palette.bg },
    header: { padding: '8px 12px', color: palette.headerText, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' },
    headerDescription: { padding: '0 12px 8px 12px', color: palette.headerText, fontSize: '12px' },
    list: { padding: '8px' },
    row: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', color: palette.text },
    label: { flex: 1 },
    icon: { width: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: palette.icon },
    hoverIcon: { color: palette.hoverIcon },
    parent: {},
    child: { paddingLeft: '28px' },
  };

  const styles = useMemo(() => ({
    container: { ...defaults.container, ...(customStyles.container || {}), ...(styleProps.container || {}) },
    header: { ...defaults.header, ...(customStyles.header || {}), ...(styleProps.header || {}) },
    headerDescription: { ...defaults.headerDescription, ...(customStyles.headerDescription || {}), ...(styleProps.headerDescription || {}) },
    list: { ...defaults.list, ...(customStyles.list || {}), ...(styleProps.list || {}) },
    row: { ...defaults.row, ...(customStyles.row || {}), ...(styleProps.row || {}) },
    label: { ...defaults.label, ...(customStyles.label || {}), ...(styleProps.label || {}) },
    icon: { ...defaults.icon, ...(customStyles.icon || {}), ...(styleProps.icon || {}) },
    hoverIcon: { ...defaults.hoverIcon, ...(customStyles.hoverIcon || {}), ...(styleProps.hoverIcon || {}) },
    parent: { ...defaults.parent, ...(customStyles.parent || {}), ...(styleProps.parent || {}) },
    child: { ...defaults.child, ...(customStyles.child || {}), ...(styleProps.child || {}) },
    sectionHeader: { ...(customStyles.sectionHeader || {}), ...(styleProps.sectionHeader || {}) },
  }), [customStyles, styleProps]);

  const [openIds, setOpenIds] = useState(() => new Set());
  const [openSectionIds, setOpenSectionIds] = useState(() => new Set());

  const isParent = (item) => Array.isArray(item.children) && item.children.length > 0;
  const getId = (item, idx, parentPath = '') => item.id ?? `${parentPath}${idx}`;

  // Default disclosure and item icons
  const DefaultParentOpenIcon = (
    <span style={{ fontSize: 14 }}>▼</span>
  );
  const DefaultParentClosedIcon = (
    <span style={{ fontSize: 14 }}>▶</span>
  );
  const DefaultParentIcon = (
    <span style={{ fontSize: 14 }}>📁</span>
  );
  const DefaultChildIcon = (
    <span style={{ fontSize: 14 }}>🗂️</span>
  );
  const DefaultHoverIcon = (
    <span style={{ fontSize: 16 }}>…</span>
  );

  const toggle = (itemId, item) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
      onToggle(item, next.has(itemId));
      return next;
    });
  };

  const Row = ({ item, depth = 0, index, parentPath = '' }) => {
    const [hovered, setHovered] = useState(false);
    const id = getId(item, index, `${parentPath}${depth}-`);
    const parent = isParent(item);
    const open = parent && openIds.has(id);

    return (
      <UI.Box>
        <UI.Box
          onClick={() => { onItemClick(item); if (parent) toggle(id, item); }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ ...styles.row, ...(parent ? styles.parent : styles.child), paddingLeft: parent ? `${10 + depth * 16}px` : `${28 + depth * 16}px` }}
          className="json-to-list-row"
        >
          {parent ? (
            <>
              {/* Disclosure icon for parent (open/closed) */}
              <UI.Box style={styles.icon}>
                {open ? (parentOpenIcon || DefaultParentOpenIcon) : (parentClosedIcon || DefaultParentClosedIcon)}
              </UI.Box>
              {/* Item icon (per-item override, then parentIcon, then default) */}
              <UI.Box style={styles.icon}>
                {item.icon || parentIcon || DefaultParentIcon}
              </UI.Box>
            </>
          ) : (
            <UI.Box style={styles.icon}>
              {item.icon || childIcon || DefaultChildIcon}
            </UI.Box>
          )}
          <UI.Box style={styles.label}>{item.label}</UI.Box>
          <UI.Box className="json-to-list-row-hover" style={{ ...styles.icon, ...styles.hoverIcon, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease' }}>
            {hoverIcon || DefaultHoverIcon}
          </UI.Box>
        </UI.Box>
        {parent && open && (
          <UI.Box>
            {item.children.map((child, cIdx) => (
              <Row key={getId(child, cIdx, id + '-')} item={child} depth={depth + 1} index={cIdx} parentPath={id + '-'} />
            ))}
          </UI.Box>
        )}
      </UI.Box>
    );
  };

  // Section rendering
  const renderSectionHeader = (id, title, description, collapsible = true, defaultOpen = true) => {
    const baselineOpen = !!(defaultOpen || !collapsible);
    const isOpen = openSectionIds.has(id) ? !baselineOpen : baselineOpen;
    const toggle = () => setOpenSectionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    return (
      <UI.Box key={`header-${id}`} className={classNames.sectionHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 8px 4px 8px', ...styles.sectionHeader }}>
        <UI.Box className={classNames.sectionHeaderLeft} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {collapsible && (
            <button aria-label={`Toggle ${title}`} onClick={toggle} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span>{isOpen ? '▼' : '▶'}</span>
            </button>
          )}
          <UI.Heading className={classNames.heading} style={{ margin: 0, color: '#ffffff' }}>{title}</UI.Heading>
        </UI.Box>
        {description && (
          <UI.Text className={classNames.text} style={{ opacity: 0.8 }}>{description}</UI.Text>
        )}
      </UI.Box>
    );
  };

  const renderSections = () => {
    // Explicit sections with filter
    if (Array.isArray(sections) && sections.length) {
      return sections.map((sec, sIdx) => {
        const id = sec.id || `sec-${sIdx}`;
        const header = renderSectionHeader(id, sec.title, sec.description, sec.collapsible !== false, sec.defaultOpen !== false);
        const baselineOpen = !!(sec.defaultOpen !== false || sec.collapsible === false);
        const isOpen = openSectionIds.has(id) ? !baselineOpen : baselineOpen;
        const items = (sec.filter ? data.filter(sec.filter) : data) || [];
        return (
          <React.Fragment key={`frag-${id}`}>
            {header}
            {(!sec.collapsible || isOpen) && (
              <UI.Box style={styles.list}>
                {items.map((item, idx) => (
                  <Row key={getId(item, idx)} item={item} index={idx} />
                ))}
              </UI.Box>
            )}
          </React.Fragment>
        );
      });
    }

    // groupBy mode
    if (typeof groupBy === 'function') {
      const buckets = new Map();
      data.forEach((item) => {
        const key = groupBy(item) ?? 'Other';
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(item);
      });
      const titles = sectionOrder && sectionOrder.length ? sectionOrder.filter(t => buckets.has(t)) : Array.from(buckets.keys());
      return titles.map((title, sIdx) => {
        const id = `grp-${sIdx}-${title}`;
        const header = renderSectionHeader(id, title, null, true, true);
        const baselineOpen = true;
        const isOpen = openSectionIds.has(id) ? !baselineOpen : baselineOpen;
        return (
          <React.Fragment key={`frag-${id}`}>
            {header}
            {isOpen && (
              <UI.Box style={styles.list}>
                {buckets.get(title).map((item, idx) => (
                  <Row key={getId(item, idx)} item={item} index={idx} />
                ))}
              </UI.Box>
            )}
          </React.Fragment>
        );
      });
    }

    // default (no sections)
    return (
      <UI.Box style={styles.list}>
        {data.map((item, idx) => (
          <Row key={getId(item, idx)} item={item} index={idx} />
        ))}
      </UI.Box>
    );
  };

  return (
    <UI.Container className={classNames.container} style={styles.container}>
      <UI.Box className={classNames.header} style={styles.header}>
        <UI.Box className={classNames.headerLeft} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {startIcon && (<UI.Box style={styles.icon}>{startIcon}</UI.Box>)}
          <span className={classNames.title}>{headerTitle}</span>
        </UI.Box>
      </UI.Box>
      {headerDescription && (
        <UI.Box className={classNames.headerDescription} style={styles.headerDescription}>
          {headerDescription}
        </UI.Box>
      )}
      {renderSections()}
    </UI.Container>
  );
}
