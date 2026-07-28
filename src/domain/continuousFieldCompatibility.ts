export interface ContinuousFieldCompatibilitySuccess {
  ok: true;
  message: string;
}

export interface ContinuousFieldCompatibilityFailure {
  ok: false;
  errors: string[];
}

export type ContinuousFieldCompatibilityResult =
  | ContinuousFieldCompatibilitySuccess
  | ContinuousFieldCompatibilityFailure;

const maxReportedIssues = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function report(errors: string[], message: string): void {
  if (errors.length < maxReportedIssues) errors.push(message);
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function passagePending(item: Record<string, unknown>): number | undefined {
  if (!isRecord(item.passageSummary)) return undefined;
  return typeof item.passageSummary.pending === 'number'
    ? item.passageSummary.pending
    : undefined;
}

export function validateContinuousShareFieldCompatibility(
  input: unknown
): ContinuousFieldCompatibilityResult {
  const errors: string[] = [];
  if (!isRecord(input) || !Array.isArray(input.items)) {
    return {
      ok: true,
      message: 'Compatibilidade entre campos será avaliada após a estrutura da partilha ser reconhecida.'
    };
  }

  input.items.forEach((item, index) => {
    if (!isRecord(item)) return;
    const path = `$.items[${index}]`;
    const hasThemeId = hasOwn(item, 'themeId') && item.themeId !== undefined;
    const noTheme = item.noTheme;
    const hasPackageId = hasOwn(item, 'packageId') && item.packageId !== undefined;
    const hasPackageLabel = hasOwn(item, 'packageLabel') && item.packageLabel !== undefined;
    const hasDepth = hasOwn(item, 'depth') && item.depth !== undefined;
    const kind = item.kind;
    const status = item.status;
    const endedEarly = item.endedEarly;
    const pending = passagePending(item);

    if (hasThemeId && noTheme === true) {
      report(errors, `${path}: themeId não pode coexistir com noTheme igual a true.`);
    }

    if (hasPackageId !== hasPackageLabel) {
      report(errors, `${path}: packageId e packageLabel precisam aparecer juntos.`);
    }

    if (kind === 'trail') {
      if (hasPackageId || hasPackageLabel) {
        report(errors, `${path}: Rastro não pode declarar pacote de ciclo temático.`);
      }
      if (hasDepth) {
        report(errors, `${path}.depth: Rastro não pode declarar profundidade de ciclo.`);
      }
      if (status === 'declined') {
        report(errors, `${path}.status: estado declined pertence somente a ciclo temático.`);
      }
      if (endedEarly === true) {
        report(errors, `${path}.endedEarly: Rastro não pode declarar encerramento antecipado de ciclo.`);
      }
    }

    if (status === 'declined' && kind !== 'theme-cycle') {
      report(errors, `${path}.status: estado declined exige kind igual a theme-cycle.`);
    }

    if (endedEarly === true) {
      if (kind !== 'theme-cycle') {
        report(errors, `${path}.endedEarly: encerramento antecipado exige kind igual a theme-cycle.`);
      }
      if (status !== 'incomplete') {
        report(errors, `${path}: endedEarly igual a true exige status incomplete.`);
      }
    }

    if (status === 'completed') {
      if (endedEarly === true) {
        report(errors, `${path}: status completed não pode coexistir com endedEarly igual a true.`);
      }
      if (pending !== undefined && pending !== 0) {
        report(errors, `${path}.passageSummary.pending: status completed exige zero passagens pendentes.`);
      }
    }
  });

  return errors.length > 0
    ? { ok: false, errors }
    : {
        ok: true,
        message: 'Tema, pacote, tipo, estado e encerramento permanecem compatíveis entre si.'
      };
}

export function validateContinuousResponseFieldCompatibility(
  _input: unknown
): ContinuousFieldCompatibilityResult {
  return {
    ok: true,
    message: 'O pacote de resposta atual não possui discriminantes opcionais adicionais a reconciliar.'
  };
}
