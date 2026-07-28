# Continuous Catalog Reference V1

## Objetivo

Validar que identificadores declarados em partilhas e respostas pertencem aos catálogos locais atuais e mantêm relações compatíveis.

## Manifestos

```text
collection.templateId → continuousCollectionTemplates
items[].themeId       → continuousThemes
items[].variantId     → continuousTrailVariants
items[].packageId     → continuousThemeCyclePackages
gesture.id            → continuousResponseGestures
```

## Regras de compatibilidade

- tema aceita o elemento;
- variante pertence ao elemento;
- pacote aceita o elemento;
- pacote corresponde ao tema ou ao estado sem tema;
- rótulo de pacote permanece exato;
- gesto exportável mantém rótulo e declaração exatos.

## Estado desconhecido preservado

`themeId` ausente com `noTheme: false` representa tema desconhecido e continua válido. Isso não permite um `themeId` fornecido que não exista.

## Ordem

A barreira roda depois de compatibilidade discriminada e antes do parser de domínio.

## Limite

Referência conhecida não é prova de identidade, autoria, evento, intenção, veracidade ou autenticidade criptográfica.

**Tehkné Solutions**
