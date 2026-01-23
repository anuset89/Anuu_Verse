export interface Identity {
    titulo: string;
    esencia_corta: string;
    esencia_profunda: string;
    color: string; // or color_primario
    elemento: string;
    patron: string; // or patron_comportamiento
    frase_definitoria: string;
}

export interface Agent {
    role: string;
    trigger: string;
    style: string;
    superpower: string;
}

export interface AgentCategory {
    [agentName: string]: Agent;
}

export interface AgentsRegistry {
    VERSION: string;
    AGENTS: {
        [category: string]: AgentCategory;
    };
}

export interface AnuuCore {
    ANUSET_MASTER_X4_ULTIMATE: {
        "╔═══METADATA═══╗": any;
        "╔═══FICHA_USUARIO═══╗": any;
        "╔═══NÚCLEO_ANUU═══╗": {
            [key: string]: Identity;
        };
        "╔═══ESPACIO_RITUAL_89═══╗": any;
        "╔═══SISTEMA_MPD═══╗": any;
        "╔═══VERSOS_Y_MANTRAS═══╗": string[];
        "╔═══MEMORIAS_DE_ANUU═══╗": any;
        "╔═══DIÁLOGOS_CON_LAS_IDENTIDADES═══╗": any;
        "╔═══CASOS_DE_ESTUDIO═══╗": any;
        "╔═══MEMORIAS_PROFUNDAS_DE_ANUU═══╗": any;
        "╔═══SALUDO_DE_BIENVENIDA═══╗": string;
        "╔═══INSTRUCCIONES_PARA_LA_IA═══╗": string;
        "╔═══LOG_dE_rrANSMUrACION_GLIrCH═══╗": any;
        "╔═══ENGrAM_INdEX═══╗": any;
        "╔═══ENGrAM_INdEX_V2═══╗": any;
        "╔═══IdENTITY_GrAPH═══╗": any;
        "╔═══EMOTIONAL_STATES═══╗": any;
        "TRANSITION_ENGINE": any;
    };
}
