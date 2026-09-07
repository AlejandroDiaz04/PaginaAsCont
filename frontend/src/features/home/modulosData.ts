export type ModuloId =
  | "stock"
  | "facturacion"
  | "inventario"
  | "reportes"
  | "finanzas"
  | "rrhh";

export type ModuloDetalle = {
  titulo: string;
  icono: string;
  logo: string;
  descripcion: string;
  caracteristicas: string[];
  beneficios: string;
};

export const MODULOS_DATA: Record<ModuloId, ModuloDetalle> = {
  stock: {
    titulo: "Gestión de Stock",
    icono: "/assets/images/stock.png",
    logo: "/assets/images/logoNube.png",
    descripcion:
      "Control completo de tu inventario con herramientas profesionales",
    caracteristicas: [
      "Carga de mercaderías y clasificación según grupos y familias. Permite la configuración de cuentas para ventas de mercaderías y costeo",
      "Gestión de lista de precios de mercaderías",
      "Gestión de Inventario Inicial",
      "Gestión de Inventario Físico y Comparativo",
      "Anulación de Comprobantes de entrada, salida, transferencia y notas de envío",
      "Gestión de transferencias entre depósitos y sucursales",
      "Gestión de entrada y salida de mercaderías",
      "Notas de Envío de Mercaderías",
      "Informes: Lista de artículos por grupos, Valorización de stock, Listado por inventario y mantenimiento, Artículos por sucursales y depósitos, Lista de precios, Fichas de Movimientos, Existencia de artículos por depósito, Resumen de movimientos por artículos, Listado de artículos con stock mínimo",
    ],
    beneficios:
      "Controlá tu inventario de forma precisa: registrá entradas, salidas y transferencias, mantené tus precios actualizados y accedé a reportes detallados para optimizar compras y evitar quiebres o excesos de stock.",
  },
  facturacion: {
    titulo: "Facturación y Ventas",
    icono: "/assets/images/facturcion.png",
    logo: "/assets/images/logoNube.png",
    descripcion:
      "Sistema integral para gestionar todas tus operaciones de venta",
    caracteristicas: [
      "Gestión de facturas de compras",
      "Gestión de facturas de ventas",
      "Gestión de pedidos y presupuestos",
      "Puntos de venta",
      "Informes de compras",
      "Informes de ventas",
      "Gestión de órdenes de trabajo",
      "Adelantos por productos",
      "Gestión de contratos",
      "Reprocesamiento de costo y ganancia por factura",
      "Gestión de repartos",
    ],
    beneficios:
      "Agiliza tus ventas, reduce errores de facturación y mantén un control preciso de todas las operaciones comerciales.",
  },
  inventario: {
    titulo: "Control de Inventario",
    icono: "/assets/images/inventario.png",
    logo: "/assets/images/logoNube.png",
    descripcion: "Mantén tu stock actualizado con inventarios físicos precisos",
    caracteristicas: [
      "Creación de planillas de inventario por secciones",
      "Inventario con dispositivos móviles",
      "Comparación automática",
      "Ajustes de inventario",
      "Valorización del inventario",
      "Reportes de diferencias",
      "Programación de inventarios",
      "Múltiples usuarios simultáneamente",
    ],
    beneficios:
      "Elimina las diferencias de inventario, detecta mermas y mantén información 100% confiable de tus existencias.",
  },
  reportes: {
    titulo: "Reportes y Análisis",
    icono: "/assets/images/reportes.png",
    logo: "/assets/images/logoNube.png",
    descripcion: "Información precisa para tomar las mejores decisiones",
    caracteristicas: [
      "Reportes de ventas por período",
      "Análisis de rentabilidad",
      "Estadísticas de clientes",
      "Gráficos interactivos",
      "Exportación a múltiples formatos",
      "Comparativas entre períodos",
      "Reportes de productos",
      "Proyecciones y tendencias",
    ],
    beneficios:
      "Toma decisiones basadas en datos reales, identifica oportunidades y mejora la estrategia de tu negocio.",
  },
  finanzas: {
    titulo: "Gestión Financiera",
    icono: "/assets/images/finanzas.png",
    logo: "/assets/images/logoNube.png",
    descripcion: "Control total de tu flujo de efectivo",
    caracteristicas: [
      "Control de cajas y bancos",
      "Conciliación bancaria",
      "Gestión de cheques",
      "Control de cobranzas",
      "Registro de gastos",
      "Cuentas corrientes",
      "Proyección de flujo",
      "Integración contable",
    ],
    beneficios:
      "Mantén el control financiero de tu empresa, evita cheques rechazados y optimiza tu capital de trabajo.",
  },
  rrhh: {
    titulo: "Recursos Humanos",
    icono: "/assets/images/RRHH.png",
    logo: "/assets/images/logoNube.png",
    descripcion: "Administra tu personal de forma eficiente",
    caracteristicas: [
      "Gestión de legajos",
      "Liquidación de sueldos",
      "Cálculo automático",
      "Generación de aguinaldos",
      "Planillas para organismos",
      "Control de asistencias",
      "Recibos digitales",
      "Integración contable",
    ],
    beneficios:
      "Simplifica la gestión de RRHH, asegura el cumplimiento legal y dedica más tiempo a tu negocio.",
  },
};

export type ModuloCard = {
  id: ModuloId;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  variant: "lateral" | "centro";
};

export const MODULO_CARDS: ModuloCard[] = [
  {
    id: "stock",
    title: "Control de Stock",
    description:
      "Nos apasiona crear soluciones hechas a tu medida, pensadas para acompañar cada paso de tu negocio, alineadas con tus objetivos y tus procesos.",
    image: "/assets/images/ControlStock.jpg",
    imageAlt: "Control de stock - Gestión de inventario",
    variant: "lateral",
  },
  {
    id: "facturacion",
    title: "Facturacion y Ventas",
    description:
      "Permite automatizar tareas repetitivas, de alto volumen y bajo valor agregado, liberando al personal para enfocarse en actividades estratégicas y de mayor impacto.",
    image: "/assets/images/FacturacionYVenta.jpg",
    imageAlt: "Facturación y ventas - RPA",
    variant: "centro",
  },
  {
    id: "reportes",
    title: "Reportes y Analisis",
    description:
      "Permite que diferentes aplicaciones, plataformas y bases de datos se conecten y trabajen de manera coordinada, evitando redundancia de información y duplicidad de tareas.",
    image: "/assets/images/AnalisisYReportes.jpg",
    imageAlt: "Reportes y análisis - Integraciones",
    variant: "lateral",
  },
  {
    id: "inventario",
    title: "Gestion de inventario",
    description:
      "El beneficio de tener aplicaciones móviles radica en permitir una conexión directa y constante con clientes y colaboradores, facilitando el acceso rápido a productos o servicios.",
    image: "/assets/images/GestionInventario.jpg",
    imageAlt: "Gestión de inventario - Control de stock",
    variant: "lateral",
  },
  {
    id: "finanzas",
    title: "Reconocimiento facial y de objetos",
    description:
      "Permite controlar accesos de manera más confiable que los métodos tradicionales, reducir riesgos de suplantación y optimizar la vigilancia con detección en tiempo real.",
    image: "/assets/images/GestionFinanciera.jpg",
    imageAlt: "Gestión financiera - Reconocimiento facial",
    variant: "centro",
  },
  {
    id: "rrhh",
    title: "Sistemas de gestión",
    description:
      "Permiten organizar, controlar y optimizar los procesos de una empresa de manera estructurada y eficiente. Ayudan a estandarizar procedimientos y asegurar calidad.",
    image: "/assets/images/rrhh.jpg",
    imageAlt: "Sistemas de gestión - Recursos humanos",
    variant: "lateral",
  },
];
