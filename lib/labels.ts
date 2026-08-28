export const statusLabels: Record<string, string> = {
  DRAFT: "Borrador", OPTION: "En opción", REQUESTED: "Solicitada", PARTIALLY_CONFIRMED: "Parcialmente confirmada", CONFIRMED: "Confirmada", IN_PROGRESS: "En curso", TRAVELLED: "Viajada", CANCELLED: "Cancelada", CLOSED: "Cerrada",
  OPEN: "Abierta", DONE: "Completada", PLANNED: "Planificada", PAID: "Pagada", OVERDUE: "Vencida", VOID: "Anulada", ISSUED: "Emitida", SENT: "Enviada", ACCEPTED: "Aceptada", REJECTED: "Rechazada", EXPIRED: "Vencida", CONVERTED: "Convertida"
};

export const activityTypeLabels: Record<string, string> = { SERVICE: "Servicio", PICKUP: "Recogida", PAYMENT: "Pago", DEADLINE: "Vencimiento", MEETING: "Reunión" };

const taskTitles: Record<string, string> = {
  "Assign airport transfer vehicle": "Asignar vehículo para el traslado del aeropuerto",
  "Confirm Saona supplier request": "Confirmar la solicitud con el proveedor de Saona"
};

export function translateTaskTitle(title: string) { return taskTitles[title] ?? title; }
