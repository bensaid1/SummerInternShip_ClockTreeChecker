// src/utils/validator.ts
export function validateJsonFile(json: any): { errors: string[] } {
  const errors: string[] = [];
  if (!json.tree) errors.push("Missing 'tree' property.");
  if (!json.tree?.id) errors.push("Missing 'id' in 'tree'.");
  if (!json.tree?.schema_version) errors.push("Missing 'schema_version' in 'tree'.");
  if (!json.tree?.elements) errors.push("Missing 'elements' in 'tree'.");
  if (!json.tree?.transitions) errors.push("Missing 'transitions' in 'tree'.");
  if (json.tree && !Array.isArray(json.tree.elements))
    errors.push("Structure invalide : 'tree.elements' doit être un tableau.");
  if (json.tree && !("transitions" in json.tree))
    errors.push("❌ Erreur: la section 'transitions' est absente du JSON.");
  if (json.tree && json.tree.transitions && !Array.isArray(json.tree.transitions))
    errors.push("❌ Erreur: 'tree.transitions' doit être un tableau.");
  // Validation des éléments
  if (Array.isArray(json.tree?.elements)) {
    json.tree.elements.forEach((el: any, idx: number) => {
      if (!el.name) errors.push(`❌ Erreur: propriété obligatoire 'name' manquante à '/tree/elements/${idx}'.`);
      if (!el.id) errors.push(`❌ Erreur: propriété obligatoire 'id' manquante à '/tree/elements/${idx}'.`);
      if (!el.position) errors.push(`❌ Erreur: propriété obligatoire 'position' manquante à '/tree/elements/${idx}'.`);
      if (!el.type) errors.push(`❌ Erreur: propriété obligatoire 'type' manquante à '/tree/elements/${idx}'.`);
      if (!el.label) errors.push(`❌ Erreur: propriété obligatoire 'label' manquante à '/tree/elements/${idx}'.`);
      if (!el.default) errors.push(`❌ Erreur: propriété obligatoire 'default' manquante à '/tree/elements/${idx}'.`);
      if (!el.outputTargets) errors.push(`❌ Erreur: propriété obligatoire 'outputTargets' manquante à '/tree/elements/${idx}'.`);
      if (!el.size) errors.push(`❌ Erreur: propriété obligatoire 'size' manquante à '/tree/elements/${idx}'.`);
    });
  }
  return { errors };
}