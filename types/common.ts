import type {
  Post,
  Site,
  Paciente,
  Despesa,
  Ganho,
  Feedback,
  Anamnese,
  Documento,
  Agenda,
  Foto,
  Estoque,
} from '@prisma/client';
import type { PropsWithChildren } from 'react';

export type WithChildren<T = {}> = T & PropsWithChildren<{}>;

export type WithClassName<T = {}> = T & {
  className?: string;
};

export interface WithSitePost extends Post {
  site: Site | null;
}

export interface WithSiteFeedback extends Feedback {
  site: Site | null;
}

export interface WithSitePaciente extends Paciente {
  site: Site | null;
}

export interface WithPacienteAnamnese extends Anamnese {
  paciente: Paciente | null;
}

export interface WithSiteDespesa extends Despesa {
  site: Site | null;
}

export interface WithSiteGanho extends Ganho {
  site: Site | null;
}
export interface WithSiteEstoque extends Estoque {
  site: Site | null;
}

export interface WithPacienteFoto extends Foto {
  paciente: Paciente | null;
}

export interface WithPacienteDocumento extends Documento {
  paciente: Paciente | null;
}

export interface WithPacienteAgenda extends Agenda {
  paciente: Paciente | null;
}
