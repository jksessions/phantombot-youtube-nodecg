"use strict";

import { NodeCG } from "nodecg/types/server";

let context: NodeCG;

/**
 * * Adds NodeCG types
 * @returns context
 */
export function get(): NodeCG {
	return context;
}

/**
 * * Sets nodecg context for reference in subscripts
 * @param ctx references initial nodecg init
 */
export function set(ctx: NodeCG): void {
	context = ctx;
}
